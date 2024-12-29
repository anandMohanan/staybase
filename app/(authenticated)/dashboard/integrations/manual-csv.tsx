"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Papa from 'papaparse';
import { Upload, AlertCircle, Loader } from 'lucide-react';
import { UploadCustomer } from '@/server/customer';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

export const CSVUploadComponent = () => {
    const [csvData, setCSVData] = useState([]);
    const [error, setError] = useState('');
    const [headers, setHeaders] = useState([]);
    const [csvText, setCsvText] = useState('');

    const expectedHeaders = ['customer_id', 'email', 'name', 'last_order_date', 'total_orders', 'total_spent'];

    const processCSVData = (results) => {
        const fileHeaders = results.meta.fields;
        const missingHeaders = expectedHeaders.filter(h => !fileHeaders.includes(h));

        if (missingHeaders.length > 0) {
            setError(`Missing required columns: ${missingHeaders.join(', ')}`);
            setCSVData([]);
            setHeaders([]);
            return;
        }

        setHeaders(fileHeaders);
        setCSVData(results.data.slice(0, 5));
        setError('');
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: processCSVData,
                error: () => {
                    setError('Error parsing CSV file');
                    setCSVData([]);
                    setHeaders([]);
                }
            });
        }
    };

    const handlePaste = (text) => {
        setCsvText(text);
        Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: processCSVData,
            error: () => {
                setError('Error parsing CSV data');
                setCSVData([]);
                setHeaders([]);
            }
        });
    };



    const { mutate: handleSubmit, isPending } = useMutation({
        mutationFn: async () => {
            await UploadCustomer({ customerData: csvData });
            setCsvText('');
            setCSVData([]);
            setHeaders([]);
        },
        onSuccess: () => {
            toast.success('Customers uploaded successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const DataPreview = () => (
        <div className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {headers.length > 0 && (
                <>
                    <Button onClick={() => handleSubmit()} className="w-full">
                    {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                        Upload Data
                    </Button>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {headers.map((header) => (
                                        <TableHead key={header}>{header}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {csvData.map((row, index) => (
                                    <TableRow key={index}>
                                        {headers.map((header) => (
                                            <TableCell key={`${index}-${header}`}>{row[header]}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Manual Customer Import</CardTitle>
                <CardDescription>
                    Upload your customer data using our CSV template
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="upload" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">File Upload</TabsTrigger>
                        <TabsTrigger value="paste">Paste Data</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4">
                        <Button variant="outline" className="w-full" onClick={() => document.getElementById('csvUpload').click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            Choose CSV File
                        </Button>
                        <input
                            id="csvUpload"
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                        <DataPreview />
                    </TabsContent>

                    <TabsContent value="paste" className="space-y-4">
                        <Textarea
                            placeholder="Paste your CSV data here..."
                            className="min-h-[200px] font-mono"
                            value={csvText}
                            onChange={(e) => handlePaste(e.target.value)}
                        />
                        <DataPreview />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

