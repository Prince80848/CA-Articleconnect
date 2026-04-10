require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Define a minimal Student model in case the file paths are complex
const StudentRecord = mongoose.model('Student', new mongoose.Schema({
    resume: String
}, { strict: false }));

cloudinary.config({
    cloud_name: (process.env.CLOUDINARY_NAME || '').trim(),
    api_key: (process.env.CLOUDINARY_API_KEY || '').trim(),
    api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim()
});

async function migrate() {
    try {
        await mongoose.connect((process.env.MONGODB_URI || '').trim());
        console.log('MongoDB Connected');

        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            console.log('No uploads directory found');
            process.exit(0);
        }

        const files = fs.readdirSync(uploadsDir);
        for (const file of files) {
            if (file.endsWith('.pdf') && file.startsWith('resume-')) {
                const filePath = path.join(uploadsDir, file);
                console.log(`\nProcessing file: ${file}`);
                
                try {
                    const result = await cloudinary.uploader.upload(filePath, {
                        folder: 'articleconnect_resumes',
                        resource_type: 'raw', 
                        public_id: file.replace('.pdf', '')
                    });

                    console.log(`Upload successful -> ${result.secure_url}`);

                    // Use regex to catch the filename no matter what the parent path slash format is
                    const students = await StudentRecord.find({ resume: { $regex: file, $options: 'i' } });
                    
                    if (students.length > 0) {
                        for (const student of students) {
                            console.log(`Found matching student profile! Updating resume URL...`);
                            await StudentRecord.updateOne(
                                { _id: student._id },
                                { $set: { resume: result.secure_url } }
                            );
                            console.log(`Success: Fixed application resume link!`);
                        }
                    } else {
                        console.log(`No student documents found referencing ${file}`);
                    }
                } catch (err) {
                    console.error(`Failed to process ${file}:`, err.message);
                }
            }
        }
        
        console.log('\nMigration complete.');
        process.exit(0);
    } catch (err) {
        console.error('Fatal Error:', err);
        process.exit(1);
    }
}

migrate();
