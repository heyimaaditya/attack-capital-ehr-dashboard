'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Patient, PatientUpdatePayload } from "@/types/drchrono";
import { createPatient, updatePatient, deletePatient } from "@/services/drchrono";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import PatientFormModal from "./PatientFormModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

interface PatientTableProps {
  patients: Patient[];
}

export default function PatientTable({ patients }: PatientTableProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const openCreateModal = () => {
    setEditingPatient(null);
    setIsModalOpen(true);
  };

  const openEditModal = (patient: Patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  const openDeleteAlert = (patient: Patient) => {
    setPatientToDelete(patient);
    setIsDeleteAlertOpen(true);
  };

  const handleFormSubmit = async (patientData: PatientUpdatePayload) => {
    try {
      const tokenRes = await fetch('/api/token');
      if (!tokenRes.ok) throw new Error("Failed to get auth token");
      const { accessToken } = await tokenRes.json();

      if (editingPatient) {
        await updatePatient(editingPatient.id, patientData, accessToken);
        toast.success("Patient updated successfully!");
      } else {
        await createPatient(patientData as any, accessToken);
        toast.success("Patient created successfully!");
      }
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to save patient:", error);
      toast.error("Failed to save patient. Please try again.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;
    try {
      const tokenRes = await fetch('/api/token');
      if (!tokenRes.ok) throw new Error("Failed to get auth token");
      const { accessToken } = await tokenRes.json();

      await deletePatient(patientToDelete.id, accessToken);
      toast.success("Patient deleted successfully!");
      setIsDeleteAlertOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete patient:", error);
      toast.error("Failed to delete patient. Please try again.");
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Patient Records</CardTitle>
          <Button onClick={openCreateModal}>Add New Patient</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.id}</TableCell>
                  <TableCell>{patient.first_name}</TableCell>
                  <TableCell>{patient.last_name}</TableCell>
                  <TableCell>{patient.date_of_birth}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(patient)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteAlert(patient)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PatientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingPatient}
      />

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the patient record for {patientToDelete?.first_name} {patientToDelete?.last_name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}