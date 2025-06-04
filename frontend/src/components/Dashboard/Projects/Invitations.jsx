import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../../../firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Invitations.module.scss';

function Invitations() {
  const user = auth.currentUser;
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const invitesQuery = query(
      collection(db, 'invites'),
      where('toUserId', '==', user.uid),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(invitesQuery, (snapshot) => {
      const invitesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInvitations(invitesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching invitations:", error);
      toast.error("Failed to load invitations");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAcceptInvite = async (inviteId, projectId) => {
    try {
      // Update invitation status
      await updateDoc(doc(db, 'invites', inviteId), {
        status: 'accepted',
        updatedAt: serverTimestamp()
      });

      // Add user to project team
      await updateDoc(doc(db, 'projects', projectId), {
        teamMembers: arrayUnion(user.uid),
        updatedAt: serverTimestamp(),
        lastUpdatedBy: user.uid
      });

      toast.success("Invitation accepted! You've been added to the project.");
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Failed to accept invitation");
    }
  };

  const handleDeclineInvite = async (inviteId) => {
    try {
      await updateDoc(doc(db, 'invites', inviteId), {
        status: 'declined',
        updatedAt: serverTimestamp()
      });
      toast.success("Invitation declined");
    } catch (error) {
      console.error("Error declining invitation:", error);
      toast.error("Failed to decline invitation");
    }
  };

  if (loading) {
    return <div>Loading invitations...</div>;
  }

  return (
    <div className={styles.invitationsContainer}>
      <h2>Project Invitations</h2>
      
      {invitations.length === 0 ? (
        <p>You have no pending invitations</p>
      ) : (
        <div className={styles.invitationsList}>
          {invitations.map(invite => (
            <div key={invite.id} className={styles.invitationCard}>
              <div className={styles.invitationInfo}>
                <h3>{invite.projectName}</h3>
                <p>Invited by: {invite.fromUserEmail}</p>
                <small>Sent on: {invite.createdAt?.toDate().toLocaleString()}</small>
              </div>
              <div className={styles.invitationActions}>
                <button 
                  className={styles.acceptButton}
                  onClick={() => handleAcceptInvite(invite.id, invite.projectId)}
                >
                  Accept
                </button>
                <button 
                  className={styles.declineButton}
                  onClick={() => handleDeclineInvite(invite.id)}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Invitations;