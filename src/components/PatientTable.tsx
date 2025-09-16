'use client';

import { Patient } from "@/types/drchrono";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";

interface PatientTableProps {
    patients: Patient[];
}

export default function PatientTable({ patients }: PatientTableProps) {
    if (!patients || patients.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Patients</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>No patient records found.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Patient Records</CardTitle>
                <Button>Add New Patient</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>First Name</TableHead>
                            <TableHead>Last Name</TableHead>
                            <TableHead>Date of Birth</TableHead>
                            <TableHead>Gender</TableHead>
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
                                <TableCell>{patient.gender}</TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" className="mr-2">View</Button>
                                    <Button variant="outline" size="sm">Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
