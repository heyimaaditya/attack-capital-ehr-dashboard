'use client';

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Patient, PatientCreatePayload, PatientUpdatePayload } from "@/types/drchrono";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface PatientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (patientData: PatientUpdatePayload) => Promise<void>;
    initialData?: Patient | null;
}

type PatientFormData = {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: 'Male' | 'Female' | 'Other' | '';
    email: string;
};


export default function PatientFormModal({ isOpen, onClose, onSubmit, initialData }: PatientFormModalProps) {
    const [formData, setFormData] = useState<PatientFormData>({
        first_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        email: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                first_name: initialData.first_name || "",
                last_name: initialData.last_name || "",
                date_of_birth: initialData.date_of_birth || "",
                gender: initialData.gender === 'Male' || initialData.gender === 'Female' || initialData.gender === 'Other' ? initialData.gender : '',
                email: initialData.email || "",
            });
        } else {
            setFormData({
                first_name: "",
                last_name: "",
                date_of_birth: "",
                gender: "",
                email: "",
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.gender === '') {

            alert("Please select a gender.");
            return;
        }
        const apiPayload: PatientUpdatePayload = {
            ...formData,
            gender: formData.gender as 'Male' | 'Female' | 'Other',
        };

        if (!initialData) {
            (apiPayload as PatientCreatePayload).doctor = 1;
        }

        await onSubmit(apiPayload);
        setIsLoading(false);

    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Patient" : "Add New Patient"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="first_name">First Name</Label>
                        <Input id="first_name" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} required />
                    </div>
                    <div>
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input id="last_name" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} required />
                    </div>
                    <div>
                        <Label htmlFor="date_of_birth">Date of Birth</Label>
                        <Input id="date_of_birth" type="date" value={formData.date_of_birth} onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} required />
                    </div>
                    <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={formData.gender} onValueChange={(value: 'Male' | 'Female' | 'Other') => setFormData({ ...formData, gender: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}