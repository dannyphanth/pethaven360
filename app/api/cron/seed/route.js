import { NextResponse } from 'next/server';
import { seedInitialData } from '@/backend/seedInitialData';
import { seedAppointments } from '@/backend/seedData';

export const runtime = 'nodejs';

export async function GET(request) {
    try {
        // Verify the request is from Vercel Cron
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Run the seeding process
        await seedInitialData();
        await seedAppointments();

        return NextResponse.json({
            success: true,
            message: 'Data seeding completed successfully'
        });
    } catch (error) {
        console.error('Error during seeding:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
} 