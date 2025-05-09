// Define an interface for type safety
interface speciality {
    speciality: string;
    image: string; // or appropriate type if it's an imported asset (e.g., StaticImageData for Next.js)
  }
  
  // Import your images (replace with actual import paths or variable types)
  import General_physician from '../assets/General_physician.svg';
  import Gastroenterologist from '../assets/Gastroenterologist.svg';
  import Gynecologist from '../assets/Gynecologist.svg';
  import Pediatricians from '../assets/Pediatricians.svg';
  import Neurologist from '../assets/Neurologist.svg';
  import Dermatologist from '../assets/Dermatologist.svg';
  
  export const specialityData: speciality[] = [
    {
      speciality: 'General Physician',
      image: General_physician
    },
   
    {
      speciality: 'Gynecologist',
      image: Gynecologist
    },
    {
      speciality: 'Pediatrician',
      image: Pediatricians
    },
    {
      speciality: 'Neurologist',
      image: Neurologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
     {
      speciality: 'Gastroenterologist',
      image: Gastroenterologist
    }
  ];

  import doc1 from './doc1.png';
  import doc2 from './doc2.png';
  import doc3 from './doc3.png';
  import doc4 from './doc4.png';
  import doc5 from './doc5.png';
  import doc6 from './doc6.png';
  import doc7 from './doc7.png';
  import doc8 from './doc8.png';
  import doc9 from './doc9.png';
  import doc10 from './doc10.png';
  
  export interface Doctor {
    _id: string;
    name: string;
    Image: string;
    speciality: string;
    degree: string;
    experience: string;
    about: string;
    fees: number;
    
    address: {
      line1: string;
      line2: string;
    };
  }
  
  export const doctors: Doctor[] = [
    {
      _id: 'doc1',
      name: 'Dr. Amal James',
      Image: doc1,
      speciality: 'General Physician',
      degree: 'MBBS',
      experience: '4 years',
      about: 'Experienced general physician focused on preventive care and early diagnosis.',
      fees: 50,
      address: {
        line1: 'Beirut, Lebanon',
        line2: 'Hamra Street, 101'
      }
    },
    {
      _id: 'doc2',
      name: 'Dr. Rania El-Hassan',
      Image: doc2,
      speciality: 'Gynecologist',
      degree: 'MD, DGO',
      experience: '7 years',
      about: 'Specialist in women’s health, prenatal care, and hormonal therapy.',
      fees: 65,
      address: {
        line1: 'Sidon, Lebanon',
        line2: 'Main Market Road, 45B'
      }
    },
    {
      _id: 'doc3',
      name: 'Dr. Samer Ghali',
      Image: doc3,
      speciality: 'Pediatrician',
      degree: 'MBBS, MD',
      experience: '5 years',
      about: 'Pediatric expert with a warm, child-friendly approach.',
      fees: 55,
      address: {
        line1: 'Tripoli, Lebanon',
        line2: 'Al-Mina District, 12'
      }
    },
    {
      _id: 'doc4',
      name: 'Dr. Laila Majzoub',
      Image: doc4,
      speciality: 'Gastroenterologist',
      degree: 'MBBS, DM',
      experience: '8 years',
      about: 'Experienced in managing chronic digestive conditions and liver disorders.',
      fees: 70,
      address: {
        line1: 'Beirut, Lebanon',
        line2: 'Verdun Boulevard, 27A'
      }
    },
    {
      _id: 'doc5',
      name: 'Dr. Firas Daher',
      Image: doc5,
      speciality: 'Neurologist',
      degree: 'MD, DM Neurology',
      experience: '9 years',
      about: 'Focuses on treating epilepsy, migraines, and neurodegenerative diseases.',
      fees: 80,
      address: {
        line1: 'Zahle, Lebanon',
        line2: 'Park Street, B12'
      }
    },
    {
      _id: 'doc6',
      name: 'Dr. Nour Al-Khoury',
      Image: doc6,
      speciality: 'General Physician',
      degree: 'MBBS',
      experience: '6 years',
      about: 'Skilled in managing acute illnesses and chronic disease follow-ups.',
      fees: 50,
      address: {
        line1: 'Tyre, Lebanon',
        line2: 'Coastal Road, 9C'
      }
    },
    {
      _id: 'doc7',
      name: 'Dr. Ahmad Sleiman',
      Image: doc7,
      speciality: 'Cardiologist',
      degree: 'MD, DM Cardiology',
      experience: '10 years',
      about: 'Renowned cardiologist focused on patient education and preventive care.',
      fees: 90,
      address: {
        line1: 'Beirut, Lebanon',
        line2: 'Achrafieh, Block 2'
      }
    },
    {
      _id: 'doc8',
      name: 'Dr. Shadi Al Hanna',
      Image: doc8,
      speciality: 'Cardiologist',
      degree: 'MD, DDVL',
      experience: '5 years',
      about: 'Expert in treating acne, skin allergies, and cosmetic dermatology.',
      fees: 60,
      address: {
        line1: 'Jounieh, Lebanon',
        line2: 'Marina Road, 16'
      }
    },
    {
        _id: 'doc9',
        name: 'Dr. Huda Safa',
        Image: doc9,
        speciality: 'Dermatologist',
        degree: 'MD, DDVL',
        experience: '7 years',
        about: 'Expert in treating acne, skin allergies, and cosmetic dermatology.',
        fees: 60,
        address: {
          line1: 'Jounieh, Lebanon',
          line2: 'Marina Road, 16'
        }
      },
      {
        _id: 'doc10',
        name: 'Dr. Ahmad Safa',
        Image: doc10,
        speciality: 'Dermatologist',
        degree: 'MD, DDVL',
        experience: '7 years',
        about: 'Expert in treating acne, skin allergies, and cosmetic dermatology.',
        fees: 60,
        address: {
          line1: 'Jounieh, Lebanon',
          line2: 'Marina Road, 16'
        }
      }
  ];
  
  