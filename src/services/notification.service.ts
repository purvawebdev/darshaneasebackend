import { Notification } from '../models/notification.model';
import { Server } from 'socket.io';
import nodemailer from 'nodemailer';

class NotificationService {
    private io: Server | null = null;
    private transporter: nodemailer.Transporter | null = null;

    constructor() {
        // Initialize Nodemailer with dummy config for V1 testing
        // Developers should overwrite these with genuine SMTP config from .env
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: parseInt(process.env.SMTP_PORT || '587'),
            auth: {
                user: process.env.SMTP_USER || 'ethereal_user',
                pass: process.env.SMTP_PASS || 'ethereal_pass'
            }
        });
    }

    public initializeSockets(ioInstance: Server) {
        this.io = ioInstance;
        console.log("Socket.IO initialized for Notifications.");
    }

    public async sendPushNotification(userId: string, title: string, body: string, type: string = 'system') {
        try {
            // 1. Save to DB
            const notif = await Notification.create({ user: userId, title, body, type });
            
            // 2. Emit to socket if online
            if (this.io) {
                // Assuming users join a room matching their ID: socket.join(userId)
                this.io.to(userId).emit('new_notification', notif);
            }
            return notif;
        } catch (error) {
            console.error('Error sending push notification', error);
        }
    }

    public async sendEmailConfirmation(toEmail: string, subject: string, message: string) {
        if (!this.transporter) return;
        try {
            await this.transporter.sendMail({
                from: '"DarshanEase" <noreply@darshanease.com>',
                to: toEmail,
                subject: subject,
                text: message
            });
            console.log(`Email sent to ${toEmail}`);
        } catch (error) {
            console.error('Email send failed', error);
        }
    }
}

export const notificationService = new NotificationService();
