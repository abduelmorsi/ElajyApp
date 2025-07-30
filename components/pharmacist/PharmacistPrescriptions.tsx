import React, { useState } from 'react';
import { ArrowLeft, FileText, CheckCircle, X, AlertCircle, Eye, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const prescriptions = [
  {
    id: "RX-001",
    patient: "John Doe",
    doctor: "Dr. Smith",
    date: "2024-01-15",
    medications: [
      { name: "Amoxicillin 250mg", dosage: "1 tablet 3x daily", duration: "7 days" },
      { name: "Paracetamol 500mg", dosage: "1-2 tablets as needed", duration: "As needed" }
    ],
    status: "pending",
    uploadTime: "2024-01-15T10:30:00",
    notes: "Patient allergic to penicillin - verify amoxicillin allergy status"
  },
  {
    id: "RX-002",
    patient: "Sarah Smith", 
    doctor: "Dr. Johnson",
    date: "2024-01-14",
    medications: [
      { name: "Vitamin D3 1000IU", dosage: "1 tablet daily", duration: "3 months" }
    ],
    status: "verified",
    uploadTime: "2024-01-14T16:20:00",
    verifiedBy: "Dr. Sarah Wilson",
    verifiedTime: "2024-01-14T16:45:00"
  },
  {
    id: "RX-003",
    patient: "Mike Johnson",
    doctor: "Dr. Brown", 
    date: "2024-01-13",
    medications: [
      { name: "Ibuprofen 400mg", dosage: "1 tablet 2x daily", duration: "5 days" }
    ],
    status: "rejected",
    uploadTime: "2024-01-13T14:15:00",
    rejectionReason: "Prescription expired - dated more than 6 months ago"
  }
];

export default function PharmacistPrescriptions({ navigateTo }) {
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-yellow-600" />;
      case 'verified': return <CheckCircle size={16} className="text-green-600" />;
      case 'rejected': return <X size={16} className="text-red-600" />;
      default: return <FileText size={16} className="text-gray-600" />;
    }
  };

  const verifyPrescription = (prescriptionId) => {
    console.log(`Verifying prescription ${prescriptionId}`);
  };

  const rejectPrescription = (prescriptionId, reason) => {
    console.log(`Rejecting prescription ${prescriptionId}: ${reason}`);
  };

  const pendingPrescriptions = prescriptions.filter(rx => rx.status === 'pending');
  const verifiedPrescriptions = prescriptions.filter(rx => rx.status === 'verified');
  const rejectedPrescriptions = prescriptions.filter(rx => rx.status === 'rejected');

  const PrescriptionCard = ({ prescription, showActions = true }) => (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow" 
      onClick={() => setSelectedPrescription(prescription)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            {getStatusIcon(prescription.status)}
            <h4 className="text-sm">Prescription #{prescription.id}</h4>
          </div>
          <p className="text-xs text-muted-foreground">{prescription.patient}</p>
          <p className="text-xs text-muted-foreground">Dr. {prescription.doctor}</p>
        </div>
        <Badge className={getStatusColor(prescription.status)}>
          {prescription.status}
        </Badge>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Medications:</p>
          {prescription.medications.slice(0, 2).map((med, index) => (
            <p key={index} className="text-sm">{med.name}</p>
          ))}
          {prescription.medications.length > 2 && (
            <p className="text-sm text-muted-foreground">+{prescription.medications.length - 2} more</p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Date: {new Date(prescription.date).toLocaleDateString()}</span>
          <span>Uploaded: {new Date(prescription.uploadTime).toLocaleString()}</span>
        </div>
      </div>

      {showActions && prescription.status === 'pending' && (
        <div className="flex space-x-2 mt-3">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              verifyPrescription(prescription.id);
            }}
          >
            Verify
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              rejectPrescription(prescription.id, 'Review required');
            }}
          >
            Reject
          </Button>
        </div>
      )}

      {prescription.notes && (
        <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
          <div className="flex items-start space-x-2">
            <AlertCircle size={14} className="text-yellow-600 mt-0.5" />
            <p className="text-xs text-yellow-700 dark:text-yellow-300">{prescription.notes}</p>
          </div>
        </div>
      )}
    </Card>
  );

  if (selectedPrescription) {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="sm" onClick={() => setSelectedPrescription(null)}>
            <ArrowLeft size={16} />
          </Button>
          <h3>Prescription Details</h3>
          <div></div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Prescription Info */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4>Prescription #{selectedPrescription.id}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedPrescription.uploadTime).toLocaleString()}
                </p>
              </div>
              <Badge className={getStatusColor(selectedPrescription.status)}>
                {selectedPrescription.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Patient</p>
                <p>{selectedPrescription.patient}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Doctor</p>
                <p>Dr. {selectedPrescription.doctor}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date Issued</p>
                <p>{new Date(selectedPrescription.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="capitalize">{selectedPrescription.status}</p>
              </div>
            </div>
          </Card>

          {/* Prescription Image */}
          <Card className="p-4">
            <h4 className="mb-3">Prescription Image</h4>
            <div className="bg-muted rounded-lg h-48 flex items-center justify-center">
              <div className="text-center">
                <FileText size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Prescription Document</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Eye size={14} className="mr-1" />
                  View Full Size
                </Button>
              </div>
            </div>
          </Card>

          {/* Medications */}
          <Card className="p-4">
            <h4 className="mb-3">Prescribed Medications</h4>
            <div className="space-y-3">
              {selectedPrescription.medications.map((med, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded">
                  <h5 className="text-sm">{med.name}</h5>
                  <p className="text-xs text-muted-foreground">Dosage: {med.dosage}</p>
                  <p className="text-xs text-muted-foreground">Duration: {med.duration}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Notes */}
          {selectedPrescription.notes && (
            <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200">
              <h4 className="mb-2 text-yellow-800 dark:text-yellow-200">Important Notes</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {selectedPrescription.notes}
              </p>
            </Card>
          )}

          {/* Verification Info */}
          {selectedPrescription.status === 'verified' && (
            <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200">
              <h4 className="mb-2 text-green-800 dark:text-green-200">Verification Details</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Verified by {selectedPrescription.verifiedBy} on{' '}
                {new Date(selectedPrescription.verifiedTime).toLocaleString()}
              </p>
            </Card>
          )}

          {/* Rejection Info */}
          {selectedPrescription.status === 'rejected' && (
            <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200">
              <h4 className="mb-2 text-red-800 dark:text-red-200">Rejection Reason</h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                {selectedPrescription.rejectionReason}
              </p>
            </Card>
          )}

          {/* Actions */}
          {selectedPrescription.status === 'pending' && (
            <div className="space-y-3">
              <Button className="w-full" onClick={() => verifyPrescription(selectedPrescription.id)}>
                Verify Prescription
              </Button>
              <Button variant="outline" className="w-full" onClick={() => rejectPrescription(selectedPrescription.id, 'Review required')}>
                Reject Prescription
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="sm" onClick={() => navigateTo('pharmacist-dashboard')}>
          <ArrowLeft size={16} />
        </Button>
        <h3>Prescription Verification</h3>
        <div></div>
      </div>

      <Tabs defaultValue="pending" className="flex-1 flex flex-col">
        <div className="p-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending ({pendingPrescriptions.length})</TabsTrigger>
            <TabsTrigger value="verified">Verified ({verifiedPrescriptions.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedPrescriptions.length})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pending" className="flex-1 overflow-y-auto px-4 space-y-4">
          {pendingPrescriptions.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
              <h4 className="mb-2">No Pending Prescriptions</h4>
              <p className="text-muted-foreground">New prescriptions requiring verification will appear here</p>
            </div>
          ) : (
            pendingPrescriptions.map((prescription) => (
              <PrescriptionCard key={prescription.id} prescription={prescription} />
            ))
          )}
        </TabsContent>

        <TabsContent value="verified" className="flex-1 overflow-y-auto px-4 space-y-4">
          {verifiedPrescriptions.map((prescription) => (
            <PrescriptionCard key={prescription.id} prescription={prescription} showActions={false} />
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="flex-1 overflow-y-auto px-4 space-y-4">
          {rejectedPrescriptions.map((prescription) => (
            <PrescriptionCard key={prescription.id} prescription={prescription} showActions={false} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}