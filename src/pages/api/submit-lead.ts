import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

// Email recipients - modify these for production
const RECIPIENTS = [
  'leads@buckscountyfence.com',
  'admin@buckscountyfence.com',
  // Add more recipients as needed
];

// Nodemailer transporter configuration
// For production, use actual SMTP credentials from environment variables
const createTransporter = () => {
  // Check if we have SMTP credentials
  if (import.meta.env.SMTP_HOST && import.meta.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: import.meta.env.SMTP_HOST,
      port: parseInt(import.meta.env.SMTP_PORT || '587'),
      secure: import.meta.env.SMTP_SECURE === 'true',
      auth: {
        user: import.meta.env.SMTP_USER,
        pass: import.meta.env.SMTP_PASSWORD,
      },
    });
  }
  
  // Fallback to Ethereal for testing (creates test account automatically)
  return null;
};

// Format the lead data for email
function formatLeadEmail(data: any): string {
  const formatValue = (key: string, value: any): string => {
    const formatters: Record<string, (v: any) => string> = {
      projectType: (v) => ({
        new_fence: 'New Fence Installation',
        fence_repair: 'Fence Repair',
        fence_replacement: 'Fence Replacement',
        gate_installation: 'Gate Installation',
        other: 'Other',
      }[v] || v),
      fenceMaterial: (v) => ({
        wood: 'Wood',
        vinyl: 'Vinyl',
        aluminum: 'Aluminum',
        chain_link: 'Chain Link',
        wrought_iron: 'Wrought Iron',
        not_sure: 'Not Sure Yet',
      }[v] || v),
      timeline: (v) => ({
        asap: 'As Soon As Possible',
        within_week: 'Within 1 Week',
        within_month: 'Within 1 Month',
        '1_3_months': '1-3 Months',
        '3_plus_months': '3+ Months',
        just_researching: 'Just Researching',
      }[v] || v),
      propertyType: (v) => ({
        single_family: 'Single Family Home',
        townhouse: 'Townhouse',
        condo: 'Condominium',
        apartment: 'Apartment',
        commercial: 'Commercial Property',
        other: 'Other',
      }[v] || v),
      fencePurpose: (v) => {
        if (!Array.isArray(v)) return v;
        const purposes: Record<string, string> = {
          privacy: 'Privacy',
          security: 'Security',
          decorative: 'Decorative',
          pet_containment: 'Pet Containment',
          pool_safety: 'Pool Safety',
          property_boundary: 'Property Boundary',
          noise_reduction: 'Noise Reduction',
          other: 'Other',
        };
        return v.map(p => purposes[p] || p).join(', ');
      },
      fenceLength: (v) => ({
        under_50: 'Under 50 ft',
        '50_100': '50-100 ft',
        '100_200': '100-200 ft',
        '200_plus': '200+ ft',
        not_sure: 'Not Sure',
      }[v] || v),
    };
    
    const formatter = formatters[key];
    return formatter ? formatter(value) : String(value || 'N/A');
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
    h2 { color: #475569; margin-top: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background-color: #f1f5f9; text-align: left; padding: 12px; font-weight: 600; width: 40%; }
    td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
    .highlight { background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚧 New Fence Lead Submission</h1>
    
    <div class="highlight">
      <strong>Lead received:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
    </div>
    
    <h2>📋 Project Details</h2>
    <table>
      <tr><th>Project Type</th><td>${formatValue('projectType', data.projectType)}</td></tr>
      <tr><th>Fence Material</th><td>${formatValue('fenceMaterial', data.fenceMaterial)}</td></tr>
      <tr><th>Timeline</th><td>${formatValue('timeline', data.timeline)}</td></tr>
      <tr><th>Property Type</th><td>${formatValue('propertyType', data.propertyType)}</td></tr>
      <tr><th>Fence Purpose</th><td>${formatValue('fencePurpose', data.fencePurpose)}</td></tr>
      <tr><th>Fence Length</th><td>${formatValue('fenceLength', data.fenceLength)}</td></tr>
    </table>
    
    <h2>👤 Contact Information</h2>
    <table>
      <tr><th>Name</th><td>${data.firstName} ${data.lastName}</td></tr>
      <tr><th>Email</th><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
      <tr><th>Phone</th><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>
    </table>
    
    <h2>📍 Property Address</h2>
    <table>
      <tr><th>Street Address</th><td>${data.streetAddress}</td></tr>
      <tr><th>City</th><td>${data.city}</td></tr>
      <tr><th>ZIP Code</th><td>${data.zipCode}</td></tr>
    </table>
    
    ${data.additionalDetails ? `
    <h2>📝 Additional Details</h2>
    <p>${data.additionalDetails.replace(/\n/g, '<br>')}</p>
    ` : ''}
    
    <div class="footer">
      <p>Marketing Consent: ${data.marketingConsent ? 'Yes' : 'No'}</p>
      <p>Submitted via Bucks County Fence website</p>
    </div>
  </div>
</body>
</html>
  `;
}

// Plain text version for email clients that don't support HTML
function formatLeadPlainText(data: any): string {
  return `
NEW FENCE LEAD SUBMISSION
========================

Received: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}

PROJECT DETAILS
---------------
Project Type: ${data.projectType}
Fence Material: ${data.fenceMaterial}
Timeline: ${data.timeline}
Property Type: ${data.propertyType}
Fence Purpose: ${Array.isArray(data.fencePurpose) ? data.fencePurpose.join(', ') : data.fencePurpose}
Fence Length: ${data.fenceLength}

CONTACT INFORMATION
-------------------
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}

PROPERTY ADDRESS
----------------
Street: ${data.streetAddress}
City: ${data.city}
ZIP: ${data.zipCode}

${data.additionalDetails ? `ADDITIONAL DETAILS\n------------------\n${data.additionalDetails}\n` : ''}
Marketing Consent: ${data.marketingConsent ? 'Yes' : 'No'}
  `.trim();
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Basic validation
    const requiredFields = [
      'projectType', 'fenceMaterial', 'timeline', 'propertyType',
      'fencePurpose', 'fenceLength', 'firstName', 'lastName',
      'email', 'phone', 'streetAddress', 'city', 'zipCode'
    ];
    
    const missingFields = requiredFields.filter(field => {
      const value = data[field];
      return value === undefined || value === null || value === '' || 
             (Array.isArray(value) && value.length === 0);
    });
    
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields', 
          fields: missingFields 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Create email transporter
    const transporter = createTransporter();
    
    // If no SMTP config, log for development and return success
    if (!transporter) {
      console.log('=====================================');
      console.log('NEW LEAD SUBMITTED (Development Mode)');
      console.log('=====================================');
      console.log(JSON.stringify(data, null, 2));
      console.log('=====================================');
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Lead received (email not sent - no SMTP configured)',
          data
        }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Send email to all recipients
    const emailPromises = RECIPIENTS.map(recipient => 
      transporter.sendMail({
        from: '"Bucks County Fence Leads" <leads@buckscountyfence.com>',
        to: recipient,
        subject: `🚧 New Lead: ${data.firstName} ${data.lastName} - ${data.projectType}`,
        text: formatLeadPlainText(data),
        html: formatLeadEmail(data),
        replyTo: data.email,
      })
    );
    
    await Promise.all(emailPromises);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Lead submitted successfully',
        recipients: RECIPIENTS.length 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Error processing lead submission:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};
