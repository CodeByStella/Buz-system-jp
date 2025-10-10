import mongoose from 'mongoose';
import { Data } from '../models/data';

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/buz-sys-jp');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Clean up error values from the database
const cleanupErrorValues = async () => {
  try {
    await connectDB();
    
    const errorValues = ['#ERROR!', '#REF!', '#VALUE!', '#NAME?', '#DIV/0!', '#N/A', '#NUM!', '#NULL!'];
    
    console.log('Searching for error values in database...');
    
    // Find all documents with error values
    const itemsWithErrors = await Data.find({
      $or: errorValues.map(errorValue => ({
        value: { $regex: errorValue, $options: 'i' }
      }))
    });
    
    console.log(`Found ${itemsWithErrors.length} items with error values`);
    
    if (itemsWithErrors.length > 0) {
      // Clean up error values
      const updatePromises = itemsWithErrors.map(item => 
        Data.updateOne(
          { _id: item._id },
          { $set: { value: '' } }
        )
      );
      
      await Promise.all(updatePromises);
      console.log(`Successfully cleaned up ${itemsWithErrors.length} error values`);
      
      // Show some examples of what was cleaned
      console.log('\nExamples of cleaned items:');
      itemsWithErrors.slice(0, 5).forEach(item => {
        console.log(`- Sheet: ${item.sheet}, Cell: ${item.cell}, Old Value: ${item.value}`);
      });
    } else {
      console.log('No error values found in database');
    }
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
};

// Run cleanup if this script is executed directly
if (require.main === module) {
  cleanupErrorValues().then(() => {
    console.log('Cleanup completed');
    process.exit(0);
  }).catch((error) => {
    console.error('Cleanup failed:', error);
    process.exit(1);
  });
}

export { cleanupErrorValues };
