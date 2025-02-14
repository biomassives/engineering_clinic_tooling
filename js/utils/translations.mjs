
// Translations utility
export const translations = {
  en: {
    logoutBtn: "Logout",
    noNotesYet: "No notes yet. Add one!",
    loginTitle: "Login",
    dashboardTitle: "Appro Control Panel",
    profileTab: 'Profile',
    profileBasicInfoTitle: 'Basic Information',
    profileFullName: 'Full Name',
    profileEmail: 'Email',
    profilePhone: 'Phone',
    profileOrganization: 'Organization',
    profileRole: 'Role',
    profileBio: 'Bio',
    selectRole: 'Select Role',
    roleStudent: 'Student',
    roleProfessional: 'Professional',
    roleResearcher: 'Researcher',
    roleEducator: 'Educator',
    // Clinics tab translations
    clinicsTab: 'Clinics',
    clinicsTitle: 'Clinic Preferences',
    clinicsInterests: 'Areas of Interest',
    clinicsAvailability: 'Your Availability',
    clinicsExpertise: 'Expertise Level',

    // Learning tab translations
    learningTab: 'Learning',
    learningTitle: 'Learning Preferences',
    learningMethods: 'Preferred Learning Methods',
    currentCourses: 'Current Courses',
    learningGoals: 'Learning Goals',

    // Community tab translations
    communityTab: 'Community',
    communityTitle: 'Community Engagement',
    mentorshipInterest: 'Interested in mentoring others',
    contributionAreas: 'Areas of Contribution',
    projectIdeas: 'Project Ideas',

    // Common
    saveChanges: 'Save Changes'


  },
  he: {
    logoutBtn: "התנתק",
    noNotesYet: "עדיין אין הערות",
    loginTitle: "כניסה למערכת",
    dashboardTitle: "לוּחַ מַחווָנִים Appro",
        // Profile tab translations
        profileTab: 'פרופיל',
        profileBasicInfoTitle: 'מידע בסיסי',
        profileFullName: 'שם מלא',
        profileEmail: 'דואר אלקטרוני',
        profilePhone: 'טלפון',
        profileOrganization: 'ארגון',
        profileRole: 'תפקיד',
        profileBio: 'אודות',
        selectRole: 'בחר תפקיד',
        roleStudent: 'סטודנט',
        roleProfessional: 'איש מקצוע',
        roleResearcher: 'חוקר',
        roleEducator: 'מחנך',
    
        // Clinics tab translations
        clinicsTab: 'מרפאות',
        clinicsTitle: 'העדפות מרפאה',
        clinicsInterests: 'תחומי עניין',
        clinicsAvailability: 'זמינות שלך',
        clinicsExpertise: 'רמת מומחיות',
    
        // Learning tab translations
        learningTab: 'למידה',
        learningTitle: 'העדפות למידה',
        learningMethods: 'שיטות למידה מועדפות',
        currentCourses: 'קורסים נוכחיים',
        learningGoals: 'מטרות למידה',
    
        // Community tab translations
        communityTab: 'קהילה',
        communityTitle: 'מעורבות בקהילה',
        mentorshipInterest: 'מעוניין להדריך אחרים',
        contributionAreas: 'תחומי תרומה',
        projectIdeas: 'רעיונות לפרויקטים',
    
        // Common
        saveChanges: 'שמור שינויים'
  },
  ar: {
    logoutBtn: "تسجيل الخروج",
    noNotesYet: "لا توجد ملاحظات حتى الآن",
    loginTitle: "تسجيل الدخول",
    dashboardTitle: "لوحة القيادة",
    profileTab: "الملف الشخصي",
    profileBasicInfoTitle: "المعلومات الأساسية",
    profileFullName: "الاسم الكامل",
    profileEmail: 'e -mail',
    profilePhone:  "الهاتف",
    profileOrganization:  "المنظمة",
    profileRole: "الدور",
    profileBio:'about',
    selectRole:"اختر دورًا",
    roleStudent: "الطالب",
    roleProfessional: "محترف",
    roleResearcher: "محقق",
    roleEducator: "مربي",

    clinicsTab: "العيادات",
    clinicsTitle:  "تفضيلات العيادة",
    clinicsInterests: "المصالح" ,
    clinicsAvailability:  "توافرك" ,
    clinicsExpertise: "مستوى الخبراء" ,

    LearningTab: "التعلم" ,
    learningTitle: "تفضيلات التعلم", 
    learningMethods: "أساليب التعلم المفضلة",
    CurrentCourses: "الدورات الحالية",
    learningGoals: "أهداف التعلم",

    communityTab:  "مجتمع",
    communityTitle: "مشاركة المجتمع" ,
    mentorshipInterest: "تريد توجيه الآخرين",
    contributionAreas: "مناطق الماس",
    projectIdeas: "أفكار المشروع" 

  }
};

export const getCurrentLang = () => {
  // Check browser language preferences
  if (!navigator.language && !navigator.languages) return 'en';
  
  // Check primary language first
  if (navigator.language.startsWith('ar') || navigator.language.startsWith('he')) {
    return navigator.language.split('-')[0];
  }
  
  return 'en';
};
