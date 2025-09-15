// Placeholder for Supabase illegal dumping report logic

/**
 * TODO: Submit a report to Supabase, including file upload to Supabase Storage
 * @param {object} reportData - { photoFile, lat, lng, accuracy, timestamp }
 */
export const submitReport = async (reportData) => {
  const { photoFile, lat, lng, accuracy, timestamp } = reportData;
  console.log('Submitting report to Supabase', reportData);

  // 1. Upload photo to Supabase Storage
  // const filePath = `public/${Date.now()}_${photoFile.name}`;
  // const { data: uploadData, error: uploadError } = await supabase.storage
  //   .from('dumping-reports')
  //   .upload(filePath, photoFile);
  // if (uploadError) throw uploadError;

  // 2. Save report metadata to Supabase database
  // const { data, error } = await supabase.from('dumping_reports').insert([
  //   {
  //     photo_url: uploadData.path,
  //     lat,
  //     lng,
  //     accuracy,
  //     timestamp,
  //     status: 'pending'
  //   }
  // ]);
  // if (error) throw error;

  // For now, returning a mock response
  return {
    success: true,
    data: {
      id: `REP-${Date.now()}`,
      photoPath: `mock/path/to/${photoFile.name}`,
      lat,
      lng,
      accuracy,
      timestamp
    }
  };
};

/**
 * TODO: Fetch all reports for a user
 * @param {string} userId
 */
export const getUserReports = async (userId) => {
  console.log('Fetching reports for user', userId);
  // const { data, error } = await supabase.from('dumping_reports').select('*').eq('user_id', userId);
  return [];
};
