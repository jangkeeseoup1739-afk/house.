import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query 
} from 'firebase/firestore';
import { db } from '../firebase';
import { ConsultationInquiry } from '../types';

const COLLECTION_NAME = 'consultations';

export const subscribeToInquiries = (
  onData: (inquiries: ConsultationInquiry[]) => void,
  onError?: (err: any) => void
) => {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: ConsultationInquiry[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            name: data.name || '',
            phone: data.phone || '',
            category: data.category || '신규분양',
            interestRegion: data.interestRegion || '',
            propertyId: data.propertyId || '',
            preferredTime: data.preferredTime || '',
            message: data.message || '',
            status: data.status || '접수대기',
            adminMemo: data.adminMemo || '',
            createdAt: data.createdAt || ''
          });
        });

        // Sort descending by createdAt or id
        list.sort((a, b) => {
          const tA = a.createdAt || '';
          const tB = b.createdAt || '';
          return tB.localeCompare(tA);
        });

        onData(list);
      },
      (err) => {
        console.error('Firestore inquiry snapshot error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.error('Failed to setup inquiry subscription:', err);
    return () => {};
  }
};

export const submitInquiryToCloud = async (inquiry: ConsultationInquiry): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, inquiry.id);
    await setDoc(docRef, {
      name: inquiry.name,
      phone: inquiry.phone,
      category: inquiry.category || '신규분양',
      interestRegion: inquiry.interestRegion || '',
      propertyId: inquiry.propertyId || '',
      preferredTime: inquiry.preferredTime || '',
      message: inquiry.message || '',
      status: inquiry.status || '접수대기',
      adminMemo: inquiry.adminMemo || '',
      createdAt: inquiry.createdAt
    });
    return true;
  } catch (err) {
    console.error('Failed to save inquiry to Firestore:', err);
    return false;
  }
};

export const updateInquiryStatusInCloud = async (
  id: string, 
  status?: string, 
  adminMemo?: string
): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updates: Record<string, any> = {};
    if (status !== undefined) updates.status = status;
    if (adminMemo !== undefined) updates.adminMemo = adminMemo;
    await updateDoc(docRef, updates);
    return true;
  } catch (err) {
    console.error('Failed to update inquiry in Firestore:', err);
    return false;
  }
};

export const deleteInquiryFromCloud = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Failed to delete inquiry from Firestore:', err);
    return false;
  }
};
