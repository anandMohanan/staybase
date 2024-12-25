"use client"

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { OrganizationSettingsType } from '@/db/schema/user'
import { useForm } from 'react-hook-form'
import { SettingsFormValues, settingsFormSchema } from '@/lib/types/organization'


export const OrganizationSettingsComponent = ({
    settings,
    onUpdateAction
}: {
    settings: OrganizationSettingsType
    onUpdateAction: (values: SettingsFormValues) => Promise<void>
}) => {
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: {
            automaticCampaigns: settings.automaticCampaigns,
            riskThreshold: settings.riskThreshold as 'LOW' | 'MEDIUM' | 'HIGH',
            notificationPreferences: settings.notificationPreferences,
            autoArchiveDays: settings.autoArchiveDays
        }
    })

    async function onSubmit(data: SettingsFormValues) {
        await onUpdateAction(data)
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Organization Settings</CardTitle>
                <CardDescription>
                    Configure how your organization handles campaigns, notifications, and data management.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="automaticCampaigns"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Automatic Campaigns</FormLabel>
                                        <FormDescription>
                                            Automatically create campaigns for high-risk customers
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="riskThreshold"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Risk Threshold</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select risk threshold" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="LOW">Low</SelectItem>
                                            <SelectItem value="MEDIUM">Medium</SelectItem>
                                            <SelectItem value="HIGH">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Set the risk level that triggers automatic actions
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notificationPreferences.digest"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Report Digest Frequency</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select digest frequency" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="DAILY">Daily</SelectItem>
                                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                                            <SelectItem value="NONE">None</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="autoArchiveDays"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Auto-Archive Period</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select archive period" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="7">7 days</SelectItem>
                                            <SelectItem value="14">14 days</SelectItem>
                                            <SelectItem value="30">30 days</SelectItem>
                                            <SelectItem value="60">60 days</SelectItem>
                                            <SelectItem value="90">90 days</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Automatically archive completed campaigns after this period
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Save Settings</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

