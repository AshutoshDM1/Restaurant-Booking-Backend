import { Resend } from 'resend';

// Check if API key is configured
const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not configured in environment variables');
}

const resend = new Resend(RESEND_API_KEY);

export const emailService = {
  async sendBookingConfirmation(
    userEmail: string,
    bookingDetails: {
      name: string;
      restaurantName: string;
      numberOfGuests: number;
      bookingId: number;
      date: Date;
      time: string;
      restaurantLocation: string;
      managementLink: string;
    },
  ) {
    try {
      console.log('Attempting to send confirmation email to:', userEmail);
      const response = await resend.emails.send({
        from: 'Restaurant Booking <booking@restaurantbackend.elitedev.tech>',
        to: userEmail,
        subject: 'Booking Confirmation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2980b9; text-align: center;">Booking Confirmation</h1>
            <p>Dear ${bookingDetails.name},</p>
            <p>Thank you for choosing to dine with us! Your reservation has been confirmed.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2980b9; margin-top: 0;">Reservation Details:</h3>
              <p><strong>Restaurant:</strong> ${bookingDetails.restaurantName}</p>
              <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
              <p><strong>Date:</strong> ${bookingDetails.date.toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${bookingDetails.time}</p>
              <p><strong>Number of Guests:</strong> ${bookingDetails.numberOfGuests}</p>
              <p><strong>Location:</strong> ${bookingDetails.restaurantLocation}</p>
            </div>

            <p>Need to modify your reservation? You can manage your booking through our website.</p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="${bookingDetails.managementLink}" 
                 style="background-color: #27ae60; color: white; padding: 14px 28px; text-decoration: none; 
                        border-radius: 6px; display: inline-block; font-weight: bold;">
                Manage Reservation
              </a>
            </div>

            <p>We look forward to serving you!</p>
          </div>
        `,
      });
      console.log('Email sent successfully:', response);
      return response;
    } catch (error) {
      console.error('Detailed error sending booking confirmation email:', {
        error,
        userEmail,
        bookingDetails: {
          ...bookingDetails,
          // Exclude sensitive data if any
        },
      });
      throw error;
    }
  },

  async sendBookingCancellation(
    userEmail: string,
    bookingDetails: {
      name: string;
      restaurantName: string;
      bookingId: number;
      bookingDate: Date;
      cancellationTime: Date;
      bookingLink: string;
    },
  ) {
    try {
      console.log('Attempting to send cancellation email to:', userEmail);
      const response = await resend.emails.send({
        from: 'Restaurant Booking <booking@restaurantbackend.elitedev.tech>',
        to: userEmail,
        subject: 'Booking Cancellation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #e74c3c; text-align: center;">Booking Cancellation</h1>
            <p>Dear ${bookingDetails.name},</p>
            <p>Your reservation has been successfully cancelled.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #e74c3c; margin-top: 0;">Cancelled Reservation Details:</h3>
              <p><strong>Restaurant:</strong> ${bookingDetails.restaurantName}</p>
              <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
              <p><strong>Original Date:</strong> ${bookingDetails.bookingDate.toLocaleDateString()}</p>
              <p><strong>Cancellation Time:</strong> ${bookingDetails.cancellationTime.toLocaleString()}</p>
            </div>

            <p>We hope to see you again soon! Click below to make a new reservation.</p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="${bookingDetails.bookingLink}" 
                 style="background-color: #3498db; color: white; padding: 14px 28px; text-decoration: none; 
                        border-radius: 6px; display: inline-block; font-weight: bold;">
                Make New Reservation
              </a>
            </div>

            <p>Thank you for letting us know about your change in plans.</p>
          </div>
        `,
      });
      console.log('Cancellation email sent successfully:', response);
      return response;
    } catch (error) {
      console.error('Detailed error sending booking cancellation email:', {
        error,
        userEmail,
        bookingDetails: {
          ...bookingDetails,
          // Exclude sensitive data if any
        },
      });
      throw error;
    }
  },
};
