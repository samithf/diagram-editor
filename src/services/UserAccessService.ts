import type { AccessLevel, DiagramAccess } from "@/types";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

export class UserAccessService {
  static async shareDiagramWithUser({
    userId,
    email,
    diagramId,
    accessLevel,
    sharedBy,
  }: {
    userId: string;
    email: string;
    diagramId: string;
    accessLevel: AccessLevel;
    sharedBy: string;
  }): Promise<{ success: boolean; message: string; alreadyShared: boolean }> {
    const userAccessRef = doc(db, "userAccess", userId);
    const userAccessDoc = await getDoc(userAccessRef);

    const newAccessEntry = {
      diagramId,
      accessLevel,
      sharedAt: Timestamp.now(),
      sharedBy,
    };

    if (userAccessDoc.exists()) {
      const existingData = userAccessDoc.data();
      const accessibleDiagrams = existingData.accessibleDiagrams || [];

      // Check if diagram is already shared with this user
      const existingAccess = accessibleDiagrams.find(
        (access: DiagramAccess) => access.diagramId === diagramId
      );

      if (existingAccess) {
        if (existingAccess.accessLevel === accessLevel) {
          return {
            success: false,
            message: `Diagram is already shared with ${email} with ${accessLevel} access`,
            alreadyShared: true,
          };
        } else {
          // Update existing access level
          const updatedAccessibleDiagrams = accessibleDiagrams.map(
            (access: DiagramAccess) =>
              access.diagramId === diagramId
                ? {
                    ...access,
                    accessLevel,
                    sharedBy,
                    sharedAt: Timestamp.now(),
                  }
                : access
          );

          await updateDoc(userAccessRef, {
            accessibleDiagrams: updatedAccessibleDiagrams,
          });

          return {
            success: true,
            message: `Updated ${email}'s access to ${accessLevel}`,
            alreadyShared: true,
          };
        }
      }

      // Update existing document with new access
      await updateDoc(userAccessRef, {
        accessibleDiagrams: arrayUnion(newAccessEntry),
      });

      return {
        success: true,
        message: `Diagram shared with ${email} with ${accessLevel} access`,
        alreadyShared: false,
      };
    } else {
      // Create new document
      await setDoc(userAccessRef, {
        userId,
        email,
        accessibleDiagrams: [newAccessEntry],
      });

      return {
        success: true,
        message: `Diagram shared with ${email} with ${accessLevel} access`,
        alreadyShared: false,
      };
    }
  }

  static async getSharedDiagramsForUser(
    userId: string
  ): Promise<DiagramAccess[]> {
    const userAccessRef = doc(db, "userAccess", userId);
    const userAccessDoc = await getDoc(userAccessRef);

    if (userAccessDoc.exists()) {
      const data = userAccessDoc.data();
      const accessibleDiagramRefs: DiagramAccess[] =
        data.accessibleDiagrams || [];

      for (const access of accessibleDiagramRefs) {
        const diagramRef = doc(db, "diagrams", access.diagramId);
        const diagramSnap = await getDoc(diagramRef);
        if (diagramSnap.exists()) {
          const diagramData = diagramSnap.data();
          access.diagramName = diagramData.name;
        }
      }

      return accessibleDiagramRefs;
    } else {
      return [];
    }
  }

  static async hasAccessToDiagram(
    userId: string,
    diagramId: string
  ): Promise<boolean> {
    const userAccessRef = doc(db, "userAccess", userId);
    const userAccessDoc = await getDoc(userAccessRef);

    if (userAccessDoc.exists()) {
      const data = userAccessDoc.data();
      const accessibleDiagrams: DiagramAccess[] = data.accessibleDiagrams || [];

      return accessibleDiagrams.some(
        (access) => access.diagramId === diagramId
      );
    } else {
      return false;
    }
  }

  static async getDiagramAccessLevel(
    userId: string,
    diagramId: string
  ): Promise<AccessLevel | null> {
    const userAccessRef = doc(db, "userAccess", userId);
    const userAccessDoc = await getDoc(userAccessRef);

    if (userAccessDoc.exists()) {
      const data = userAccessDoc.data();
      const accessibleDiagrams: DiagramAccess[] = data.accessibleDiagrams || [];

      const access = accessibleDiagrams.find(
        (access) => access.diagramId === diagramId
      );

      return access ? access.accessLevel : null;
    } else {
      return null;
    }
  }
}
