import { db } from "@/firebaseConfig";
import type { Diagram } from "@/types";
import type { Edge, Node } from "@xyflow/react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

export class DiagramService {
  static async deleteDiagram(diagramId: string): Promise<void> {
    const diagramRef = doc(db, "diagrams", diagramId);
    await deleteDoc(diagramRef);
  }

  static async upsertDiagram(
    diagramData: {
      id?: string; // Optional for new diagrams
      userId: string;
      name: string;
      nodes: Node[];
      edges: Edge[];
    },
    isUpdate = false
  ): Promise<ReturnType<typeof doc>> {
    let diagramRef: ReturnType<typeof doc>;

    if (isUpdate && diagramData.id) {
      // Update existing diagram
      diagramRef = doc(db, "diagrams", diagramData.id);
      await setDoc(
        diagramRef,
        {
          name: diagramData.name,
          nodes: diagramData.nodes,
          edges: diagramData.edges,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      // Create new diagram
      diagramRef = doc(collection(db, "diagrams"));
      await setDoc(diagramRef, {
        userId: diagramData.userId,
        name: diagramData.name,
        nodes: diagramData.nodes,
        edges: diagramData.edges,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    return diagramRef;
  }

  static async getDiagram(diagramId: string) {
    const diagramRef = doc(db, "diagrams", diagramId);
    const diagramSnap = await getDoc(diagramRef);
    if (diagramSnap.exists()) {
      return diagramSnap.data();
    } else {
      throw new Error("Diagram not found");
    }
  }

  static async fetchAllDiagramsForUser(userId: string) {
    const diagramsRef = collection(db, "diagrams");
    const q = query(diagramsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const diagrams: Diagram[] = [];
    querySnapshot.forEach((doc) => {
      diagrams.push({ id: doc.id, ...doc.data() } as Diagram);
    });
    return diagrams;
  }

  static async isDiagramOwner(
    diagramId: string,
    userId: string
  ): Promise<boolean> {
    const diagramRef = doc(db, "diagrams", diagramId);
    const diagramSnap = await getDoc(diagramRef);
    if (diagramSnap.exists()) {
      const diagramData = diagramSnap.data();
      return diagramData.userId === userId;
    } else {
      throw new Error("Diagram not found");
    }
  }
}
