export const reminderEmailTemplate = (
    userName: string,
    eventName: string,
    venue: string,
    time: string
  ) => {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 12px; background-color: #f9f9f9; text-align: center;">
        <div style="max-width: 1200px; margin: 0 auto; background: #ffffff; padding: 12px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          <img 
            src="https://res.cloudinary.com/dzk5x7rjz/image/upload/v1744756604/RTU_logo_me4bn1.png" 
            alt="RTU Logo" 
            style="width: 100px; margin-bottom: 15px;" 
          />
          <div style="font-size: 13px; color: #888; margin-bottom: 25px;">
            Team Placement Cell, RTU Kota
          </div>
  
          <h2 style="font-size: 22px; color: #333; margin-bottom: 10px;">
            ⏰ Reminder
          </h2>
  
          <p style="font-size: 16px; color: #333;">
            Hello <strong>${userName}</strong>,
          </p>
          <p style="font-size: 15px; color: #555;">
            This is a gentle reminder for the event <strong>${eventName}</strong>.
          </p>
          <p style="font-size: 15px; color: #555;">
            <strong>📍 Venue:</strong> PTP Hall, PNB Building <br/>
            <strong>🕒 Time:</strong> 2:30 PM
          </p>
  
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
  
          <p style="margin-top: 8px; font-weight: bold; color: #2c3e50;"Team Placement Cell, RTU Kota</p>
          <p style="margin-top: 4px; font-size: 14px; color: #888;">For any queries, Email: <strong>placementsecy@rtu.ac.in</strong></p>
        </div>
      </div>
    `;
  }
  