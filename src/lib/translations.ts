export interface NavTranslations {
  brandName: string;
  brandSub: string;
  liveBadge: string;
  hotlineLabel: string;
  hotlineNumber: string;
  hotlineMobile: string;
  navLinks: {
    home: string;
    donors: string;
    requests: string;
    camps: string;
    support: string;
  };
  auth: {
    signIn: string;
    roleLogin: string;
    signOut: string;
    dashboard: string;
    roleAdmin: string;
    roleDonor: string;
    roleProvider: string;
  };
  langToggle: {
    bn: string;
    en: string;
  };
  footer: {
    hotlineTitle: string;
    hotlineSub: string;
    desc: string;
    protocol: string;
    servicesTitle: string;
    donors: string;
    requests: string;
    camps: string;
    support: string;
    portalsTitle: string;
    admin: string;
    donorReg: string;
    hospital: string;
    partner: string;
    qualityTitle: string;
    qualityDesc: string;
    guidelines: string;
    directDispatch: string;
    copyright: string;
    dedication: string;
  };
}

export interface HomeTranslations {
  ticker: {
    badge: string;
    urgentNeeded: string;
    patient: string;
    callNow: string;
    viewAll: string;
  };
  hero: {
    badge: string;
    titlePart1: string;
    titlePart2: string;
    desc: string;
    requestBloodBtn: string;
    registerDonorBtn: string;
    bloodGroupLabel: string;
    findDonorsBtn: string;
  };
  showcase: {
    radarHeader: string;
    hubTitle: string;
    onlineBadge: string;
    tabDispatches: string;
    tabNodes: string;
    tabReadiness: string;
    liveFeedLabel: string;
    viewAllBtn: string;
    gpsStatusTitle: string;
    gpsStatusDesc: string;
    dghsTitle: string;
    dghsDesc: string;
    findDonorsQuick: string;
    postRequestQuick: string;
    unitsInTransit: string;
    enRoute: string;
    gpsTracked: string;
    unitsInStockLabel: string;
    activeDonorsLabel: string;
    avgResponseTitle: string;
    avgResponseVal: string;
    avgResponseDesc: string;
    coldChainTitle: string;
    coldChainVal: string;
    coldChainDesc: string;
    safetyTitle: string;
    safetyVal: string;
    safetyDesc: string;
  };
  stats: {
    headerBadge: string;
    headerSync: string;
    livesSaved: string;
    livesSavedDesc: string;
    registeredDonors: string;
    registeredDonorsDesc: string;
    unitsInStock: string;
    unitsInStockDesc: string;
    connectedHospitals: string;
    connectedHospitalsDesc: string;
    loading: string;
  };
  matrix: {
    badge: string;
    title: string;
    desc: string;
    selected: string;
    choosePrompt: string;
    canGiveTo: string;
    canReceiveFrom: string;
    typesCount: string;
    giveDesc: string;
    receiveDesc: string;
    summaries: Record<string, string>;
  };
  eligibility: {
    badge: string;
    title: string;
    desc: string;
    resetBtn: string;
    q1Title: string;
    q1Desc: string;
    q2Title: string;
    q2Desc: string;
    q3Title: string;
    q3Desc: string;
    q4Title: string;
    q4Desc: string;
    yes: string;
    no: string;
    eligibleTitle: string;
    eligibleDesc: string;
    ineligibleTitle: string;
    ineligibleDesc: string;
    viewUrgentNeedsBtn: string;
  };
  alliance: {
    badge: string;
    title: string;
    desc: string;
    accredited: string;
    institution: string;
    target: string;
    units: string;
    volunteers: string;
    helpline: string;
    loading: string;
  };
  roles: {
    badge: string;
    title: string;
    desc: string;
    donorRole: string;
    donorTitle: string;
    donorDesc: string;
    donorF1: string;
    donorF2: string;
    donorF3: string;
    donorCta: string;
    providerRole: string;
    providerTitle: string;
    providerDesc: string;
    providerF1: string;
    providerF2: string;
    providerF3: string;
    providerCta: string;
    recipientRole: string;
    recipientTitle: string;
    recipientDesc: string;
    recipientF1: string;
    recipientF2: string;
    recipientF3: string;
    recipientCta: string;
  };
  cta: {
    badge: string;
    title: string;
    desc: string;
    hotlineBtn: string;
    mobileBtn: string;
    broadcastBtn: string;
    protocolTitle: string;
    protocol1: string;
    protocol2: string;
    protocol3: string;
    protocolSafety: string;
  };
}

export interface SupportTranslations {
  badge: string;
  title: string;
  desc: string;
  purposeStep: string;
  amountStep: string;
  customPlaceholder: string;
  courierTitle: string;
  courierSub: string;
  courierDesc: string;
  subsidyTitle: string;
  subsidySub: string;
  subsidyDesc: string;
  formName: string;
  formEmail: string;
  formCard: string;
  formExpiry: string;
  formCvc: string;
  submitBtn: string;
  receiptTitle: string;
  receiptDesc: string;
  receiptAmount: string;
  receiptTrxId: string;
  receiptPurpose: string;
  receiptStatus: string;
  receiptStatusVal: string;
  printBtn: string;
  againBtn: string;
  currencySymbol: string;
  currencySuffix: string;
  takaPresets: number[];
  proceedToCheckout: string;
  checkoutSubtitle: string;
  checkoutTitle: string;
  backToSupport: string;
  testModeBadge: string;
  noRealCharge: string;
  orderSummary: string;
  totalAmount: string;
  subtotal: string;
  processingFee: string;
  freeFee: string;
  supporterDetails: string;
  payWithCard: string;
  orExpress: string;
  cardInformation: string;
  nameOnCard: string;
  countryRegion: string;
  quickFillTest: string;
  payBtn: string;
  payProcessing: string;
  guaranteeSecure: string;
  taxNotice: string;
}

export interface DonorsTranslations {
  badge: string;
  title: string;
  desc: string;
  searchPlaceholder: string;
  allDivisions: string;
  availableOnly: string;
  resetBtn: string;
  bloodGroupFilter: string;
  allTypes: string;
  foundLabel: string;
  donorsCount: string;
  donations: string;
  statusAvailable: string;
  statusResting: string;
  lastDonation: string;
  callDonor: string;
  requestBlood: string;
  verifiedDonor: string;
  noDonorsTitle: string;
  noDonorsDesc: string;
}

export interface EmergencyTranslations {
  badge: string;
  title: string;
  desc: string;
  filterUrgency: string;
  filterStatus: string;
  allUrgencies: string;
  allStatuses: string;
  broadcastBtn: string;
  showingLabel: string;
  postsCount: string;
  unitsNeeded: string;
  posted: string;
  patientName: string;
  requiredBy: string;
  donorsResponding: string;
  callAttendant: string;
  pledgeBtn: string;
  cancelPledgeBtn: string;
  pledgedLabel: string;
  fulfilled: string;
  critical: string;
  urgent: string;
  standard: string;
  pending: string;
  inProgress: string;
  noRequestsTitle: string;
  noRequestsDesc: string;
  notifAcceptedTitle: string;
  notifAcceptedBody: string;
}

export interface CampsTranslations {
  badge: string;
  title: string;
  desc: string;
  drive: string;
  organizedBy: string;
  targetUnits: string;
  units: string;
  volunteersRegistered: string;
  volunteerBtn: string;
  registeredSuccess: string;
}

export const navTranslations: Record<'bn' | 'en', NavTranslations> = {
  bn: {
    brandName: 'ড্রপ অব লাইফ',
    brandSub: 'জরুরি রক্তদান ও ব্লাড ব্যাংক নেটওয়ার্ক',
    liveBadge: 'লাইভ ২৪/৭',
    hotlineLabel: 'হটলাইন',
    hotlineNumber: '০২-৯৩৫১৯৬৯',
    hotlineMobile: '০১৫২১-৭১১৭১৬',
    navLinks: {
      home: 'হোম',
      donors: 'রক্তদাতা খুঁজুন',
      requests: 'জরুরি আবেদন',
      camps: 'রক্তদান কর্মসূচি',
      support: 'জীবনদান তহবিল',
    },
    auth: {
      signIn: 'লগইন',
      roleLogin: 'ওয়ান-ক্লিক লগইন',
      signOut: 'লগআউট',
      dashboard: 'ড্যাশবোর্ড',
      roleAdmin: 'অ্যাডমিন',
      roleDonor: 'রক্তদাতা',
      roleProvider: 'হাসপাতাল',
    },
    langToggle: {
      bn: 'বাংলা',
      en: 'English',
    },
    footer: {
      hotlineTitle: '২৪/৭ জাতীয় জরুরি রক্তের হটলাইন:',
      hotlineSub: 'সারাদেশে জটিল অপারেশন ও ট্রমা রোগীদের জন্য তাৎক্ষণিক রক্ত সরবরাহ সমন্বয়।',
      desc: 'ড্রপ অব লাইফ হলো বাংলাদেশের সমন্বিত ডিজিটাল জরুরি রক্তদান ও ব্লাড ব্যাংক ইনভেন্টরি নেটওয়ার্ক। সংকটময় মুহূর্তে স্বেচ্ছাসেবী রক্তদাতাদের সাথে রোগী, আইসিইউ এবং অনুমোদিত হাসপাতালের সরাসরি সংযোগ নিশ্চিত করে।',
      protocol: 'স্বাস্থ্যসেবা ও রোগীর তথ্যের গোপনীয়তা নিশ্চিতকৃত',
      servicesTitle: 'জরুরি সেবাসমূহ',
      donors: 'উপযুক্ত রক্তদাতা খুঁজুন',
      requests: 'জরুরি রক্তের আবেদন করুন',
      camps: 'স্বেচ্ছায় রক্তদান কর্মসূচি',
      support: 'কোল্ড-চেইন এক্সপ্রেস তহবিল',
      portalsTitle: 'প্রাতিষ্ঠানিক পোর্টাল',
      admin: 'সেন্ট্রাল অ্যাডমিন কন্ট্রোল ডেস্ক',
      donorReg: 'অনুমোদিত রক্তদাতা রেজিস্ট্রি',
      hospital: 'হাসপাতাল ও ব্লাড ব্যাংক নেটওয়ার্ক',
      partner: 'স্বাস্থ্যসেবা পার্টনার হিসেবে যুক্ত হন',
      qualityTitle: 'চিকিৎসাসেবার মান ও নিরাপত্তা',
      qualityDesc: 'ড্রপ অব লাইফ জাতীয় নিরাপদ রক্ত পরিসঞ্চালন নির্দেশিকা কঠোরভাবে মেনে চলে। অংশগ্রহণকারী সকল ব্লাড ব্যাংক নিয়ন্ত্রিত তাপমাত্রা এবং নিরাপদ স্ক্রিনিং নিশ্চিত করে।',
      guidelines: 'স্বাস্থ্য অধিদপ্তর নির্দেশিকা অনুমোদিত',
      directDispatch: 'সরাসরি যোগাযোগ:',
      copyright: 'ড্রপ অব লাইফ। সর্বস্বত্ব সংরক্ষিত। প্রতিটি রক্তবিন্দু জীবন বাঁচায়।',
      dedication: 'সারাদেশে জীবন বাঁচাতে নিবেদিতপ্রাণ',
    },
  },
  en: {
    brandName: 'DropOfLife',
    brandSub: 'National Emergency Blood Bank Network',
    liveBadge: 'LIVE 24/7',
    hotlineLabel: 'Hotline',
    hotlineNumber: '02-9351969',
    hotlineMobile: '+8801521711716',
    navLinks: {
      home: 'Home',
      donors: 'Find Donors',
      requests: 'Emergency Requests',
      camps: 'Blood Drives',
      support: 'Lifesaver Fund',
    },
    auth: {
      signIn: 'Login',
      roleLogin: '1-Click Role Login',
      signOut: 'Sign Out',
      dashboard: 'Dashboard',
      roleAdmin: 'Admin',
      roleDonor: 'Donor',
      roleProvider: 'Hospital',
    },
    langToggle: {
      bn: 'বাংলা',
      en: 'English',
    },
    footer: {
      hotlineTitle: '24/7 National Emergency Blood Hotline:',
      hotlineSub: 'Immediate dispatch coordination for critical surgeries & trauma emergencies across Bangladesh.',
      desc: 'DropOfLife is Bangladesh’s unified digital emergency blood donation and blood bank inventory network. Connecting life-saving voluntary donors with patients, emergency ICUs, and verified clinics in real-time.',
      protocol: 'Certified Healthcare & Patient Privacy Protocols',
      servicesTitle: 'Emergency Services',
      donors: 'Find Compatible Donors',
      requests: 'Raise Emergency Blood Request',
      camps: 'Community Blood Donation Drives',
      support: 'Cold-Chain Express Delivery Fund',
      portalsTitle: 'Institutional Portals',
      admin: 'Super Admin Governance Desk',
      donorReg: 'Verified Blood Donor Registry',
      hospital: 'Hospital & Blood Bank Network',
      partner: 'Register as Healthcare Partner',
      qualityTitle: 'Clinical Quality & Safety',
      qualityDesc: 'DropOfLife adheres strictly to National Safe Blood Transfusion protocols. All participating blood banks maintain temperature-controlled storage and viral screening.',
      guidelines: 'DGHS Guidelines Compliant',
      directDispatch: 'Direct Dispatch:',
      copyright: 'DropOfLife. All rights reserved. Every Drop Matters.',
      dedication: 'Dedicated to saving lives across Bangladesh',
    },
  },
};

export const homeTranslations: Record<'bn' | 'en', HomeTranslations> = {
  bn: {
    ticker: {
      badge: 'জরুরি রক্তের নোটিফিকেশন',
      urgentNeeded: 'জরুরি প্রয়োজন:',
      patient: 'রোগী:',
      callNow: 'যোগাযোগ',
      viewAll: 'সব আবেদন',
    },
    hero: {
      badge: '২৪/৭ দেশব্যাপী জরুরি রক্তের সমন্বয় নেটওয়ার্ক',
      titlePart1: 'জীবনের এক ফোঁটা রক্ত,',
      titlePart2: 'বাঁচায় একটি প্রাণ।',
      desc: 'বাংলাদেশে ৬৪ জেলার যাচাইকৃত স্বেচ্ছাসেবী রক্তদাতা, হাসপাতাল ব্লাড ব্যাংক এবং জরুরি চিকিৎসা টিমের সাথে তাৎক্ষণিক সংযোগ স্থাপন করুন।',
      requestBloodBtn: 'জরুরি রক্তের আবেদন',
      registerDonorBtn: 'রক্তদাতা হিসেবে যুক্ত হোন',
      bloodGroupLabel: 'রক্তের গ্রুপ:',
      findDonorsBtn: 'রক্তদাতা খুঁজুন',
    },
    showcase: {
      radarHeader: 'লাইভ জিপিএস ডিসপ্যাচ রাডার • বাংলাদেশ',
      hubTitle: 'জরুরি রক্তের সেন্ট্রাল রেসপন্স হাব',
      onlineBadge: 'সক্রিয়',
      tabDispatches: 'চলমান সরবরাহ',
      tabNodes: 'বিভাগীয় নোড',
      tabReadiness: 'প্রস্তুতি সূচক',
      liveFeedLabel: 'লাইভ আপডেট',
      viewAllBtn: 'সব আবেদন দেখুন',
      gpsStatusTitle: 'জিপিএস ডিসপ্যাচ স্ট্যাটাস',
      gpsStatusDesc: 'দেশব্যাপী সক্রিয় পর্যবেক্ষণ • ৬৪ জেলা',
      dghsTitle: 'যাচাইকৃত ব্লাড ব্যাংক',
      dghsDesc: '১০০% স্বাস্থ্য অধিদপ্তর মানসম্মত কোল্ড-চেইন',
      findDonorsQuick: 'স্বেচ্ছাসেবী রক্তদাতা খুঁজুন',
      postRequestQuick: 'জরুরি রক্তের আবেদন',
      unitsInTransit: 'ব্যাগ রক্ত সরবরাহকৃত',
      enRoute: 'পথে রয়েছে',
      gpsTracked: 'জিপিএস ট্র্যাকিং',
      unitsInStockLabel: 'স্টক ইউনিট:',
      activeDonorsLabel: 'সক্রিয় রক্তদাতা:',
      avgResponseTitle: 'গড় রেসপন্স সময়',
      avgResponseVal: '১১.৪ মিনিট',
      avgResponseDesc: 'আবেদন পোস্ট করা থেকে রক্তদাতার সাড়া নিশ্চিতকরণের গড় সময়।',
      coldChainTitle: 'কোল্ড-চেইন পরিবহন',
      coldChainVal: '১০০% নিয়ন্ত্রিত',
      coldChainDesc: 'সকল আন্তঃজেলা প্লেটলেট ও রক্তের ব্যাগ ২°-৬° সেলসিয়াসে মনিটরকৃত।',
      safetyTitle: 'নিরাপত্তা স্ক্রিনিং',
      safetyVal: 'ডব্লিউএইচও মানসম্মত',
      safetyDesc: 'জরুরি সরবরাহের পূর্বে সকল প্রকার সংক্রমণমুক্ত স্ক্রিনিং নিশ্চিতকৃত।',
    },
    stats: {
      headerBadge: 'লাইভ প্ল্যাটফর্ম পরিসংখ্যান',
      headerSync: '৬৪ জেলায় সিঙ্ক্রোনাইজড',
      livesSaved: 'জীবন রক্ষা পেয়েছে',
      livesSavedDesc: 'সফল ট্রান্সফিউশন এবং জরুরি রক্তের ব্যাগ সফলভাবে সরবরাহকৃত',
      registeredDonors: 'নিবন্ধিত রক্তদাতা',
      registeredDonorsDesc: 'বাংলাদেশের ৮টি বিভাগ জুড়ে সক্রিয় স্বেচ্ছাসেবী জীবনরক্ষক',
      unitsInStock: 'ব্লাড ব্যাংকে রক্তের ইউনিট',
      unitsInStockDesc: 'স্বীকৃত কোল্ড-চেইন স্টোরেজে পরীক্ষিত রক্তের ব্যাগ সংরক্ষিত',
      connectedHospitals: 'সংযুক্ত হাসপাতাল',
      connectedHospitalsDesc: 'স্বীকৃত প্যাথলজি সেন্টার ও হাসপাতাল ব্লাড ব্যাংক নেটওয়ার্ক',
      loading: 'লোড হচ্ছে...',
    },
    matrix: {
      badge: 'ট্রান্সফিউশন প্রোটোকল নির্দেশিকা',
      title: 'রক্তের গ্রুপ সামঞ্জস্যতা গাইড',
      desc: 'নিরাপদ রক্তদান ও জরুরি ট্রান্সফিউশনের জন্য নিচের যেকোনো ব্লাড গ্রুপ নির্বাচন করে অ্যান্টিজেন ম্যাচিং যাচাই করুন।',
      selected: 'নির্বাচিত গ্রুপ:',
      choosePrompt: 'বিশ্লেষণের জন্য রক্তের গ্রুপ বেছে নিন:',
      canGiveTo: 'রক্তের লোহিত কণিকা দান করতে পারেন',
      canReceiveFrom: 'রক্ত গ্রহণ করতে পারেন',
      typesCount: 'টি গ্রুপ',
      giveDesc: 'গ্রুপের রক্তদাতারা হেমালাইটিক প্রতিক্রিয়া ছাড়া নিরাপদে এই গ্রহীতাদের রক্ত দিতে পারেন।',
      receiveDesc: 'গ্রুপের রোগীরা এই ম্যাচ করা রক্তদাতাদের থেকে নিরাপদে রক্ত নিতে পারেন।',
      summaries: {
        'O-': 'সার্বজনীন লোহিত রক্তদাতা! যেকোনো জরুরি ট্রমা রোগীর জন্য জীবন রক্ষাকারী।',
        'O+': 'সর্বাধিক চাহিদাসম্পন্ন রক্তের গ্রুপ। সকল পজিটিভ গ্রুপের রোগীকে রক্ত দিতে পারে।',
        'A-': 'এ এবং এবি (পজিটিভ ও নেগেটিভ উভয়) গ্রুপের রোগীদের রক্তদান করতে পারে।',
        'A+': 'বহুল প্রচলিত রক্তের গ্রুপ; ৪টি ভিন্ন গ্রুপ থেকে রক্ত গ্রহণ করতে পারে।',
        'B-': 'তুলনামূলক দুর্লভ গ্রুপ; বি এবং এবি রোগীদের জন্য অত্যন্ত গুরুত্বপূর্ণ।',
        'B+': 'দক্ষিণ এশিয়ায় উচ্চ চাহিদা; বি+ এবং এবি+ রোগীদের রক্তদান করতে পারে।',
        'AB-': 'সবচেয়ে দুর্লভ রক্তের গ্রুপ; চিকিৎসা সংক্রান্ত যেকোনো জরুরি প্লাজমা দাতা।',
        'AB+': 'সার্বজনীন রক্তগ্রহীতা! যেকোনো রক্তের গ্রুপের কাছ থেকে রক্ত গ্রহণ করতে পারে।',
      },
    },
    eligibility: {
      badge: 'ক্লিনিক্যাল প্রি-স্ক্রিনিং প্রোটোকল',
      title: 'আমি কি আজ রক্ত দিতে পারি?',
      desc: 'জাতীয় ও বিশ্ব স্বাস্থ্য সংস্থার রক্ত পরিসঞ্চালন মানদণ্ড অনুযায়ী ৪টি দ্রুত স্বাস্থ্য প্রশ্নের উত্তর দিয়ে আপনার উপযুক্ততা যাচাই করুন।',
      resetBtn: 'প্রশ্ন রিসেট করুন',
      q1Title: '১. বয়স (১৮ - ৬৫ বছর)',
      q1Desc: 'আপনার বয়স কি বর্তমানে ১৮ থেকে ৬৫ বছরের মধ্যে?',
      q2Title: '২. ওজন (≥ ৫০ কেজি)',
      q2Desc: 'আপনার শরীরের ওজন কি অন্তত ৫০ কেজি (১১০ পাউন্ড)?',
      q3Title: '৩. বিরতি (৯০+ দিন)',
      q3Desc: 'আপনার সর্বশেষ রক্তদানের পর কি অন্তত ৩ মাস (৯০ দিন) অতিক্রান্ত হয়েছে?',
      q4Title: '৪. সুস্থ শারীরিক অবস্থা',
      q4Desc: 'আপনি কি আজ জ্বর, সর্দি ও অ্যান্টিবায়োটিক সেবনমুক্ত আছেন?',
      yes: 'হ্যাঁ',
      no: 'না',
      eligibleTitle: 'অভিনন্দন! আপনি রক্তদানে সম্পূর্ণ উপযুক্ত!',
      eligibleDesc: 'আপনার উত্তরসমূহ জাতীয় ট্রান্সফিউশন নীতিমালার সাথে মিলেছে। আপনার এক ব্যাগ রক্ত ৩ জনের জীবন বাঁচাতে পারে।',
      ineligibleTitle: 'সাময়িক স্বাস্থ্যগত বিরতি আবশ্যক',
      ineligibleDesc: 'নিরাপদ রক্তদান নীতি অনুসারে শরীর স্বাভাবিক হওয়া পর্যন্ত অপেক্ষা করা উচিত। আপনার মানবিক ইচ্ছার জন্য ধন্যবাদ।',
      viewUrgentNeedsBtn: 'জরুরি আবেদন দেখুন',
    },
    alliance: {
      badge: 'স্বীকৃত স্বাস্থ্যসেবা নেটওয়ার্ক',
      title: 'পার্টনার ব্লাড ব্যাংক ও স্বেচ্ছায় রক্তদান কর্মসূচি',
      desc: 'সরাসরি ডিজিটাল ইন্টিগ্রেশন—বাংলাদেশের অনুমোদিত সরকারি-বেসরকারি হাসপাতাল ও ব্লাড ব্যাংক নেটওয়ার্ক।',
      accredited: 'স্বীকৃত',
      institution: 'প্রতিষ্ঠান:',
      target: 'টার্গেট:',
      units: 'ইউনিট',
      volunteers: 'স্বেচ্ছাসেবক:',
      helpline: '২৪/৭ হেল্পলাইন ডেস্ক:',
      loading: 'লাইভ পার্টনার ব্লাড ব্যাংক লোড হচ্ছে...',
    },
    roles: {
      badge: 'প্রত্যেক জীবনরক্ষকের জন্য ডিজিটাল ওয়ার্কফ্লো',
      title: 'ড্রপ অব লাইফ যেভাবে আপনাকে সাহায্য করে',
      desc: 'স্বেচ্ছাসেবী রক্তদাতা, স্বাস্থ্যসেবা প্রতিষ্ঠান এবং জরুরি রোগীর পরিবারের জন্য বিশেষায়িত ডিজিটাল সমাধান।',
      donorRole: 'স্বেচ্ছাসেবী রক্তদাতা',
      donorTitle: 'রক্ত দিন, জীবন বাঁচান',
      donorDesc: 'রিয়েল-টাইম অ্যাভেইলেবিলিটি অন/অফ করুন, আপনার জেলায় জরুরি নোটিফিকেশন পান এবং রক্তদানের রেকর্ড সংরক্ষণ করুন।',
      donorF1: 'তাৎক্ষণিক অ্যাভেইলেবিলিটি সুইচ (সক্রিয় বনাম বিশ্রামে)',
      donorF2: 'যাচাইকৃত জরুরি আবেদন থেকে সরাসরি যোগাযোগ',
      donorF3: 'ডিজিটাল লাইফসেভার ব্যাজ এবং ডোনেশন ট্র্যাকার',
      donorCta: 'রক্তদাতা হিসেবে নিবন্ধন',
      providerRole: 'হাসপাতাল ও ব্লাড ব্যাংক',
      providerTitle: 'ব্লাড ব্যাংক ইনভেন্টরি সমন্বয়',
      providerDesc: 'স্বাস্থ্য অধিদপ্তর স্বীকৃত মেডিকেল সেন্টারসমূহের হোল ব্লাড ও কম্পোনেন্ট ইউনিটের লাইভ স্টক আপডেট।',
      providerF1: '৮টি ব্লাড গ্রুপের রিয়েল-টাইম রক্তের স্টক ট্র্যাকিং',
      providerF2: 'স্বয়ংক্রিয় সংকটকালীন স্টক অ্যালার্ট সিস্টেম',
      providerF3: 'সরাসরি স্বেচ্ছাসেবী রক্তদাতা প্রেরণ সুবিধা',
      providerCta: 'পার্টনার হাসপাতাল পোর্টাল',
      recipientRole: 'জরুরি রোগী ও পরিবার',
      recipientTitle: 'তাৎক্ষণিক জরুরি আবেদন',
      recipientDesc: 'কয়েক সেকেন্ডে রক্তের আবেদন পোস্ট করুন। ড্রপ অব লাইফ সরাসরি আপনার জেলার রক্তদাতাদের সাথে সংযোগ করে।',
      recipientF1: 'তাৎক্ষণিক যাচাইকৃত জরুরি ব্রডকাস্ট',
      recipientF2: 'লাইভ ম্যাচ করা রক্তদাতার সংখ্যা ও ট্র্যাকিং',
      recipientF3: '২৪/৭ ডেডিকেটেড ডিসপ্যাচ হটলাইন সহায়তা',
      recipientCta: 'জরুরি আবেদন পোস্ট করুন',
    },
    cta: {
      badge: '২৪/৭ জরুরি রেসপন্স ডেস্ক',
      title: 'জরুরি রক্তের সংকটে পড়েছেন?',
      desc: 'আমাদের সেন্ট্রাল ডিসপ্যাচ ডেস্ক সরাসরি স্বেচ্ছাসেবী রক্তদাতা, জেলা হাসপাতাল ব্লাড ব্যাংক ও আইসিইউর সাথে সমন্বয় করে। সরাসরি কল করুন অথবা অনলাইনে আবেদন করুন।',
      hotlineBtn: 'হটলাইন: ০২-৯৩৫১৯৬৯',
      mobileBtn: 'মোবাইল: ০১৫২১-৭১১৭১৬',
      broadcastBtn: 'অনলাইনে আবেদন',
      protocolTitle: 'জরুরি ডিসপ্যাচ প্রোটোকল',
      protocol1: 'সরাসরি রক্তদাতা ম্যাচিং',
      protocol2: '৮টি প্রশাসনিক বিভাগে সেবা',
      protocol3: 'রিয়েল-টাইম ডেটাবেজ সিঙ্ক',
      protocolSafety: 'অনুমোদিত স্বাস্থ্যসেবা মানদণ্ড',
    },
  },
  en: {
    ticker: {
      badge: 'Emergency Alerts',
      urgentNeeded: 'Urgently Needed:',
      patient: 'Patient:',
      callNow: 'Call Now',
      viewAll: 'All Needs',
    },
    hero: {
      badge: '24/7 Nationwide Emergency Blood Coordination',
      titlePart1: 'Every Drop Matters.',
      titlePart2: 'Every Second Counts.',
      desc: 'Connect directly with verified voluntary blood donors, accredited hospital blood banks, and emergency response teams across all 64 districts in Bangladesh.',
      requestBloodBtn: 'Request Blood Urgently',
      registerDonorBtn: 'Register as Life Saver',
      bloodGroupLabel: 'Blood Group:',
      findDonorsBtn: 'Find Donors Now',
    },
    showcase: {
      radarHeader: 'LIVE GPS DISPATCH RADAR • BANGLADESH',
      hubTitle: 'Centralized Emergency Blood Response Hub',
      onlineBadge: 'Online',
      tabDispatches: 'Active Dispatches',
      tabNodes: 'Regional Nodes',
      tabReadiness: 'Readiness Index',
      liveFeedLabel: 'Live Feed',
      viewAllBtn: 'View All Needs',
      gpsStatusTitle: 'GPS Dispatch Status',
      gpsStatusDesc: 'Active Nationwide Monitoring • 64 Districts',
      dghsTitle: 'Verified Blood Banks',
      dghsDesc: '100% DGHS Standardized Cold-Chain',
      findDonorsQuick: 'Find Voluntary Donors',
      postRequestQuick: 'Post Urgent Request',
      unitsInTransit: 'Units In Transit',
      enRoute: 'En Route',
      gpsTracked: 'GPS Tracked',
      unitsInStockLabel: 'Units in stock:',
      activeDonorsLabel: 'Active Donors:',
      avgResponseTitle: 'Avg Response Time',
      avgResponseVal: '11.4 Minutes',
      avgResponseDesc: 'From emergency request posting to voluntary donor pledge confirmation.',
      coldChainTitle: 'Cold-Chain Transit',
      coldChainVal: '100% Calibrated',
      coldChainDesc: 'All inter-district platelet and PRBC transit boxes monitored under 2°C - 6°C.',
      safetyTitle: 'Safety Screening',
      safetyVal: 'WHO Standards',
      safetyDesc: 'Transfusion-transmissible infection (TTI) testing verified before emergency release.',
    },
    stats: {
      headerBadge: 'Live Platform Statistics',
      headerSync: 'Synchronized Across 64 Districts',
      livesSaved: 'Lives Saved',
      livesSavedDesc: 'Verified transfusions and emergency units successfully dispatched',
      registeredDonors: 'Registered Donors',
      registeredDonorsDesc: 'Active voluntary life savers registered across all 8 divisions',
      unitsInStock: 'Units in Blood Banks',
      unitsInStockDesc: 'Tested whole blood & component units in accredited cold-chain storage',
      connectedHospitals: 'Connected Hospitals',
      connectedHospitalsDesc: 'Accredited pathology centers and hospital blood banks online',
      loading: 'Loading...',
    },
    matrix: {
      badge: 'Interactive Transfusion Protocol',
      title: 'Blood Type Compatibility Guide',
      desc: 'Select any blood group below to inspect real-time antigen matching for donations and emergency transfusions.',
      selected: 'Selected:',
      choosePrompt: 'Choose Blood Group to Analyze:',
      canGiveTo: 'Can Donate Red Blood Cells To',
      canReceiveFrom: 'Can Receive Blood From',
      typesCount: 'Types',
      giveDesc: 'blood can safely donate red blood cells to these recipient types without triggering hemolytic transfusion reactions.',
      receiveDesc: 'blood type can safely receive emergency transfusions from these matched voluntary donors.',
      summaries: {
        'O-': 'Universal Red Blood Cell Donor! Critical for all emergency trauma patients.',
        'O+': 'Most requested blood group. Can donate to all positive blood types.',
        'A-': 'Can donate red blood cells to A and AB types (both positive and negative).',
        'A+': 'One of the most common blood types; can receive from 4 different groups.',
        'B-': 'Relatively rare blood group; crucial for B and AB recipients.',
        'B+': 'High demand in South Asia; can donate to B+ and AB+ recipients.',
        'AB-': 'Rarest blood group; universal plasma donor for medical emergencies.',
        'AB+': 'Universal Red Blood Cell Recipient! Can receive blood from any blood group.',
      },
    },
    eligibility: {
      badge: 'Clinical Pre-Screening Protocol',
      title: 'Can I Donate Blood Today?',
      desc: 'Answer 4 quick health checks to verify your safe donation eligibility according to WHO and DGHS national transfusion standards.',
      resetBtn: 'Reset Questions',
      q1Title: '1. Age (18 - 65)',
      q1Desc: 'Are you currently between 18 and 65 years of age?',
      q2Title: '2. Weight (≥ 50 kg)',
      q2Desc: 'Is your body weight at least 50 kg (110 lbs)?',
      q3Title: '3. Interval (> 90 Days)',
      q3Desc: 'Has it been 90+ days since your last donation?',
      q4Title: '4. Feeling Fit & Healthy',
      q4Desc: 'Free from active fever, cold, or antibiotics today?',
      yes: 'Yes',
      no: 'No',
      eligibleTitle: 'Congratulations! You Are Medically Eligible to Donate!',
      eligibleDesc: 'Your answers meet the national clinical criteria. Your single donation can save up to 3 lives.',
      ineligibleTitle: 'Temporary Medical Deferral Advised',
      ineligibleDesc: 'Based on safe transfusion protocols, you should wait until your health replenishes or you meet weight/interval criteria. Thank you for your lifesaving spirit!',
      viewUrgentNeedsBtn: 'View Urgent Needs',
    },
    alliance: {
      badge: 'Accredited Healthcare Network',
      title: 'Partner Blood Banks & Scheduled Drives',
      desc: 'Direct digital integration with certified hospital blood banks and voluntary donation camps across Bangladesh.',
      accredited: 'Accredited',
      institution: 'Institution:',
      target: 'Target:',
      units: 'Units',
      volunteers: 'Volunteers:',
      helpline: '24/7 Helpline Desk:',
      loading: 'Loading active partner blood bank nodes from database...',
    },
    roles: {
      badge: 'Engineered For Every Lifesaver',
      title: 'How DropOfLife Empowers You',
      desc: 'Tailored digital workflows for voluntary donors, clinical institutions, and patient families in crisis.',
      donorRole: 'Voluntary Blood Donors',
      donorTitle: 'Give Blood, Give Life',
      donorDesc: 'Set your real-time availability toggle, receive localized emergency notifications, and track your lifesaving milestones.',
      donorF1: 'Instant availability switch (Available vs Resting)',
      donorF2: 'Direct contact from verified emergency requests',
      donorF3: 'Digital lifesaver badge and donation tracker',
      donorCta: 'Register as Life Saver',
      providerRole: 'Hospitals & Blood Banks',
      providerTitle: 'Coordinate Blood Inventories',
      providerDesc: 'DGHS certified medical centers update live stock across whole blood and components (PRBC, FFP, Platelets) to prevent critical shortages.',
      providerF1: '8-blood group real-time blood stock tracking',
      providerF2: 'Automated low-stock threshold alert system',
      providerF3: 'Direct voluntary donor dispatch integration',
      providerCta: 'Partner Hospital Portal',
      recipientRole: 'Emergency Recipients & Families',
      recipientTitle: 'Fast Emergency Broadcasts',
      recipientDesc: 'Post critical blood transfusions in seconds. DropOfLife matches compatible voluntary donors within your district automatically.',
      recipientF1: 'Instant verified emergency broadcasts',
      recipientF2: 'Live matched donors count and progress tracking',
      recipientF3: '24/7 dedicated dispatch hotline assistance',
      recipientCta: 'Post Urgent Request',
    },
    cta: {
      badge: '24/7 Rapid Emergency Response Desk',
      title: 'Facing an Urgent Blood Crisis?',
      desc: 'Our centralized dispatch desk coordinates directly with registered voluntary donors, district hospital blood banks, and verified emergency ICUs nationwide. Call directly or broadcast online.',
      hotlineBtn: 'Hotline: 02-9351969',
      mobileBtn: 'Mobile: +8801521711716',
      broadcastBtn: 'Broadcast Online',
      protocolTitle: 'Emergency Dispatch Protocol',
      protocol1: 'Direct voluntary donor matching',
      protocol2: 'Covers all 8 administrative divisions',
      protocol3: 'Real-time database synchronization',
      protocolSafety: 'Accredited healthcare standards',
    },
  },
};

export const supportTranslations: Record<'bn' | 'en', SupportTranslations> = {
  bn: {
    badge: 'জীবনরক্ষক সহায়ক তহবিল',
    title: 'রক্ত পরিবহন ও স্ক্রিনিং তহবিলে অনুদান',
    desc: 'আপনার অনুদানে জরুরি প্লেটলেটের জন্য কোল্ড-চেইন ইনসুলেটেড বক্স, জরুরি ক্রস-ম্যাচিং টেস্ট ভর্তুকি এবং রক্তদাতা লজিস্টিকস পরিচালিত হয়।',
    purposeStep: '১. অনুদানের খাত বেছে নিন',
    amountStep: '২. অনুদানের পরিমাণ নির্বাচন করুন (বাংলাদেশি টাকা)',
    customPlaceholder: 'বা আপনার পছন্দসই টাকার পরিমাণ লিখুন (টাকায়)...',
    courierTitle: 'কোল্ড-চেইন এক্সপ্রেস কুরিয়ার',
    courierSub: 'নিয়ন্ত্রিত তাপমাত্রায় রক্ত পরিবহন',
    courierDesc: 'আন্তঃজেলা জরুরি প্লেটলেট ও রক্তের ব্যাগ নিরাপদে পৌঁছানোর জন্য তাপমাত্রা নিয়ন্ত্রিত বক্সের অর্থায়ন।',
    subsidyTitle: 'জীবনরক্ষক টেস্ট ভর্তুকি',
    subsidySub: 'জরুরি টেস্ট ও কিটস',
    subsidyDesc: 'অসহায় আইসিইউ রোগীদের রক্তের ক্রস-ম্যাচিং, এইচআইভি এবং হেপাটাইটিস স্ক্রিনিং পরীক্ষার খরচ বহন করে।',
    formName: 'আপনার পুরো নাম',
    formEmail: 'ইমেইল ঠিকানা',
    formCard: 'কার্ড নম্বর',
    formExpiry: 'মেয়াদ (MM/YY)',
    formCvc: 'সিভিসি',
    submitBtn: 'অনুদান সম্পন্ন করুন',
    receiptTitle: 'অনুদান সফলভাবে সম্পন্ন হয়েছে!',
    receiptDesc: 'ড্রপ অব লাইফ জরুরি রক্ত সরবরাহ ও কোল্ড-চেইন পরিবহন বক্সের অর্থায়নে আপনার সহায়তা জীবন বাঁচাবে।',
    receiptAmount: 'পরিশোধিত অনুদান:',
    receiptTrxId: 'লেনদেন আইডি:',
    receiptPurpose: 'অনুদানের খাত:',
    receiptStatus: 'স্ট্যাটাস:',
    receiptStatusVal: 'সফল (যাচাইকৃত)',
    printBtn: 'অফিসিয়াল রসিদ প্রিন্ট / সংরক্ষণ',
    againBtn: 'পুনরায় অনুদান করুন',
    currencySymbol: '৳',
    currencySuffix: 'টাকা',
    takaPresets: [500, 1000, 2000, 5000, 10000],
    proceedToCheckout: 'স্ট্রাইপ সিকিউর পেমেন্টে এগিয়ে যান →',
    checkoutSubtitle: 'কার্ডের তথ্যের জন্য নিরাপদ স্ট্রাইপ গেটওয়ে পেজে রিডাইরেক্ট করা হবে।',
    checkoutTitle: 'স্ট্রাইপ সিকিউর চেকআউট গেটওয়ে',
    backToSupport: '← অনুদান পাতায় ফিরে যান',
    testModeBadge: 'টেস্ট মোড (স্যান্ডবক্স)',
    noRealCharge: 'কোনো আসল টাকা কাটা হবে না • পরীক্ষার জন্য উন্মুক্ত',
    orderSummary: 'অনুদানের বিবরণ ও ইনভয়েস',
    totalAmount: 'মোট প্রদেয় অর্থ',
    subtotal: 'সাবটোটাল',
    processingFee: 'স্ট্রাইপ প্রসেসিং ফি',
    freeFee: '৳০ (ড্রপ অব লাইফ কর্তৃক ভর্তুকি)',
    supporterDetails: 'সাহায্যকারীর তথ্য',
    payWithCard: 'আন্তর্জাতিক বা স্থানীয় কার্ড',
    orExpress: 'বা দ্রুত এক্সপ্রেস পেমেন্ট',
    cardInformation: 'কার্ডের তথ্য ও মেয়াদ',
    nameOnCard: 'কার্ডে থাকা পুরো নাম',
    countryRegion: 'দেশ বা অঞ্চল',
    quickFillTest: '⚡ টেস্ট কার্ড অটো-ফিল (4242)',
    payBtn: 'টাকা অনুদান সম্পন্ন করুন',
    payProcessing: 'স্ট্রাইপ সিকিউর পেমেন্ট যাচাই করা হচ্ছে...',
    guaranteeSecure: 'পিসিআই-ডিএসএস লেভেল ১ সার্টিফাইড ও ২৫৬-বিট এসএসএল সুরক্ষিত',
    taxNotice: 'পেমেন্ট সম্পন্ন হওয়ার সাথে সাথে ট্যাক্স এক্সেম্পশন রসিদ তৈরি হবে।',
  },
  en: {
    badge: 'Lifesaver Supporter Fund',
    title: 'Support Blood Transport & Testing',
    desc: 'Your contributions help fund cold-chain insulated transit boxes for emergency platelets, subsidized cross-match screening tests, and volunteer donor logistics.',
    purposeStep: '1. Select Where Your Support Goes',
    amountStep: '2. Select Support Contribution (BDT ৳)',
    customPlaceholder: 'Or enter custom amount in BDT (৳)...',
    courierTitle: 'Cold-Chain Courier',
    courierSub: 'Insulated donor transport',
    courierDesc: 'Funds temperature-monitored refrigerated boxes for inter-district platelet and blood deliveries.',
    subsidyTitle: 'Lifesaver Subsidy',
    subsidySub: 'Emergency tests & testing kits',
    subsidyDesc: 'Subsidizes blood cross-matching and HIV/Hepatitis screening for indigent ICU patients.',
    formName: 'Your Full Name',
    formEmail: 'Email Address',
    formCard: 'Card Number',
    formExpiry: 'Expiry (MM/YY)',
    formCvc: 'CVC',
    submitBtn: 'Complete Contribution',
    receiptTitle: 'Payment Processed Successfully!',
    receiptDesc: 'Thank you for powering DropOfLife emergency transfusions and cold-chain courier boxes. Your generosity saves lives.',
    receiptAmount: 'Amount Contributed:',
    receiptTrxId: 'Transaction ID:',
    receiptPurpose: 'Support Purpose:',
    receiptStatus: 'Status:',
    receiptStatusVal: 'Succeeded (Verified)',
    printBtn: 'Print / Save Official Receipt',
    againBtn: 'Make Another Contribution',
    currencySymbol: '৳',
    currencySuffix: 'BDT',
    takaPresets: [500, 1000, 2000, 5000, 10000],
    proceedToCheckout: 'Proceed to Stripe Secure Checkout →',
    checkoutSubtitle: 'You will be redirected to the dedicated secure Stripe gateway page for card entry.',
    checkoutTitle: 'Stripe Secure Checkout Gateway',
    backToSupport: '← Return to Support Fund',
    testModeBadge: 'TEST MODE (SANDBOX)',
    noRealCharge: 'No real card charges • Safe testing environment',
    orderSummary: 'Contribution Summary & Invoice',
    totalAmount: 'Total Due Today',
    subtotal: 'Subtotal',
    processingFee: 'Stripe Processing Fee',
    freeFee: '৳0.00 (Covered by DropOfLife)',
    supporterDetails: 'Supporter Details',
    payWithCard: 'Pay with Card',
    orExpress: 'Or Express Checkout',
    cardInformation: 'Card Information',
    nameOnCard: 'Name on Card',
    countryRegion: 'Country or Region',
    quickFillTest: '⚡ Auto-Fill Test Card (4242)',
    payBtn: 'Donate BDT via Stripe',
    payProcessing: 'Authorizing Secure Stripe Payment...',
    guaranteeSecure: 'PCI-DSS Level 1 Certified & 256-Bit SSL Encrypted',
    taxNotice: 'A tax-deductible electronic receipt will be generated immediately.',
  },
};

export const donorsTranslations: Record<'bn' | 'en', DonorsTranslations> = {
  bn: {
    badge: 'যাচাইকৃত স্বেচ্ছাসেবী রক্তদাতাদের তালিকা',
    title: 'স্বেচ্ছাসেবী রক্তদাতা খুঁজুন',
    desc: 'আপনার জেলায় তাৎক্ষণিক সাড়া দিতে প্রস্তুত যাচাইকৃত রক্তদাতাদের সাথে সরাসরি যোগাযোগ করুন। রক্তের গ্রুপ ও বিভাগ অনুসারে ফিল্টার করুন।',
    searchPlaceholder: 'রক্তদাতার নাম, জেলা বা উপজেলা দিয়ে খুঁজুন...',
    allDivisions: 'সকল ৮টি বিভাগ',
    availableOnly: 'শুধুমাত্র সক্রিয় রক্তদাতা',
    resetBtn: 'রিসেট',
    bloodGroupFilter: 'রক্তের গ্রুপ:',
    allTypes: 'সকল গ্রুপ',
    foundLabel: 'মোট প্রাপ্ত:',
    donorsCount: 'জন রক্তদাতা',
    donations: 'বার রক্তদান',
    statusAvailable: '● সক্রিয়',
    statusResting: '○ বিশ্রামে',
    lastDonation: 'সর্বশেষ রক্তদান:',
    callDonor: 'কল করুন',
    requestBlood: 'রক্তের আবেদন',
    verifiedDonor: 'যাচাইকৃত রক্তদাতা',
    noDonorsTitle: 'কোনো রক্তদাতা পাওয়া যায়নি',
    noDonorsDesc: 'আপনার নির্বাচিত রক্তের গ্রুপ বা এলাকার সাথে মিলিয়ে সক্রিয় রক্তদাতা পাওয়া যায়নি। ফিল্টার রিসেট করে আবার চেষ্টা করুন।',
  },
  en: {
    badge: 'Verified Life Savers Directory',
    title: 'Find Voluntary Blood Donors',
    desc: 'Connect directly with verified donors ready to respond in your district. Filter by blood group, division, and live availability.',
    searchPlaceholder: 'Search donor by name, district, or hospital area...',
    allDivisions: 'All 8 Divisions',
    availableOnly: 'Available Only',
    resetBtn: 'Reset',
    bloodGroupFilter: 'Blood Group:',
    allTypes: 'All Groups',
    foundLabel: 'Found:',
    donorsCount: 'donors',
    donations: 'Donations',
    statusAvailable: '● Available',
    statusResting: '○ Resting',
    lastDonation: 'Last donation:',
    callDonor: 'Call Donor',
    requestBlood: 'Request Blood',
    verifiedDonor: 'Verified Donor',
    noDonorsTitle: 'No Registered Donors Found',
    noDonorsDesc: 'We could not find active donors matching your specific blood group or location filters.',
  },
};

export const emergencyTranslations: Record<'bn' | 'en', EmergencyTranslations> = {
  bn: {
    badge: 'জাতীয় জরুরি ট্রান্সফিউশন নেটওয়ার্ক',
    title: 'সক্রিয় জরুরি রক্তের আবেদনসমূহ',
    desc: 'আইসিইউ ও সংকটাপন্ন রোগীদের রক্তের চাহিদা। আপনি বা আপনার পরিচিত রক্তদাতা দ্রুত সাড়া দিয়ে জীবন রক্ষা করতে পারেন।',
    filterUrgency: 'জরুরি মাত্রা:',
    filterStatus: 'স্ট্যাটাস:',
    allUrgencies: 'সকল মাত্রা',
    allStatuses: 'সকল স্ট্যাটাস',
    broadcastBtn: 'জরুরি রক্তের আবেদন পোস্ট করুন',
    showingLabel: 'প্রদর্শিত:',
    postsCount: 'টি জরুরি আবেদন',
    unitsNeeded: 'ইউনিট প্রয়োজন',
    posted: 'পোস্ট করা হয়েছে',
    patientName: 'রোগীর নাম',
    requiredBy: 'প্রয়োজনীয় সময়:',
    donorsResponding: 'জন রক্তদাতা সাড়া দিচ্ছেন',
    callAttendant: 'অ্যাটেনডেন্টকে কল করুন',
    pledgeBtn: 'অঙ্গীকার করুন',
    cancelPledgeBtn: 'অঙ্গীকার বাতিল',
    pledgedLabel: 'আপনি অঙ্গীকার করেছেন',
    fulfilled: 'সম্পন্ন হয়েছে',
    critical: 'সঙ্কটাপন্ন',
    urgent: 'জরুরি',
    standard: 'স্বাভাবিক',
    pending: 'অপেক্ষমাণ',
    inProgress: 'প্রক্রিয়াধীন',
    noRequestsTitle: 'কোনো জরুরি রক্তের আবেদন নেই',
    noRequestsDesc: 'এই মুহূর্তে আপনার ফিল্টারের সাথে মিল থাকা কোনো রক্তের আবেদন নেই।',
    notifAcceptedTitle: '🩸 অঙ্গীকার নিশ্চিত!',
    notifAcceptedBody: 'একজন রক্তদাতা আপনার আবেদনে সাড়া দিয়েছেন।',
  },
  en: {
    badge: 'National Emergency Transfusion Network',
    title: 'Active Emergency Blood Requests',
    desc: 'Urgent transfusion requests from verified hospitals. Step forward to pledge life-saving blood units.',
    filterUrgency: 'Urgency:',
    filterStatus: 'Status:',
    allUrgencies: 'All Urgencies',
    allStatuses: 'All Statuses',
    broadcastBtn: 'Broadcast Blood Request',
    showingLabel: 'Showing:',
    postsCount: 'emergency posts',
    unitsNeeded: 'Units Needed',
    posted: 'Posted',
    patientName: 'Patient Name',
    requiredBy: 'Required By:',
    donorsResponding: 'donors responding',
    callAttendant: 'Call Attendant',
    pledgeBtn: 'Pledge to Donate',
    cancelPledgeBtn: 'Cancel Pledge',
    pledgedLabel: 'You Pledged',
    fulfilled: 'Fulfilled',
    critical: 'Critical',
    urgent: 'Urgent',
    standard: 'Standard',
    pending: 'Pending',
    inProgress: 'In Progress',
    noRequestsTitle: 'No Emergency Requests Found',
    noRequestsDesc: 'There are currently no active requests matching your selected filters.',
    notifAcceptedTitle: '🩸 Pledge Confirmed!',
    notifAcceptedBody: 'A donor has pledged to your blood request.',
  },
};

export const campsTranslations: Record<'bn' | 'en', CampsTranslations> = {
  bn: {
    badge: 'সামাজিক রক্তদান কর্মসূচি',
    title: 'স্বেচ্ছায় রক্তদান কর্মসূচি ও ক্যাম্প',
    desc: 'পার্টনার হাসপাতাল ও যুব সংগঠনের যৌথ উদ্যোগে আয়োজিত রক্তদান ক্যাম্প। প্রতিটি রক্তদাতা পাবেন বিনামূল্যে স্বাস্থ্য পরীক্ষা ও সার্টিফিকেট।',
    drive: 'কর্মসূচি',
    organizedBy: 'আয়োজক:',
    targetUnits: 'টার্গেট ইউনিট',
    units: 'ইউনিট',
    volunteersRegistered: 'জন স্বেচ্ছাসেবক নিবন্ধিত',
    volunteerBtn: 'স্বেচ্ছাসেবক হিসেবে যুক্ত হোন',
    registeredSuccess: 'আপনি স্বেচ্ছাসেবক হিসেবে নিবন্ধিত হয়েছেন!',
  },
  en: {
    badge: 'Community Outreach',
    title: 'Blood Donation Camps & Drives',
    desc: 'Join mobile donation camps organized by partner hospitals and youth organizations. Every donor receives free medical health checks and a digital certificate.',
    drive: 'Drive',
    organizedBy: 'Organized by',
    targetUnits: 'Target Units',
    units: 'Units',
    volunteersRegistered: 'Volunteers registered',
    volunteerBtn: 'Volunteer for this Drive',
    registeredSuccess: "You're registered as Volunteer!",
  },
};

/**
 * Converts English digits (0-9) to Bengali digits (০-৯)
 */
export function toBengaliNumber(val: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(val).replace(/\d/g, (d) => bnDigits[Number(d)]);
}

/**
 * Formats a number with comma separation and converts to Bengali digits if language === 'bn'
 */
export function formatBilingualNumber(val: number, lang: 'bn' | 'en' = 'en'): string {
  const formatted = val.toLocaleString('en-US');
  if (lang === 'bn') {
    return toBengaliNumber(formatted);
  }
  return formatted;
}

/**
 * Formats currency in Bangladeshi Taka (৳ / BDT). NO DOLLAR ($)!
 */
export function formatTaka(amount: number, lang: 'bn' | 'en' = 'en'): string {
  if (lang === 'bn') {
    return `৳${toBengaliNumber(amount.toLocaleString('en-US'))} টাকা`;
  }
  return `৳${amount.toLocaleString('en-US')} BDT`;
}
