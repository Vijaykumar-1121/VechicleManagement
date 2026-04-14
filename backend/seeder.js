const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Symptom = require('./models/Symptom');
const Condition = require('./models/Condition');

const symptoms = [
  // General
  { symptomName: 'Fever', description: 'Elevated body temperature above 98.6°F (37°C)', category: 'General' },
  { symptomName: 'Fatigue', description: 'Persistent tiredness and lack of energy', category: 'General' },
  { symptomName: 'Chills', description: 'Feeling of coldness with shivering', category: 'General' },
  { symptomName: 'Sweating', description: 'Excessive perspiration', category: 'General' },
  { symptomName: 'Weight Loss', description: 'Unintentional loss of body weight', category: 'General' },
  { symptomName: 'Loss of Appetite', description: 'Reduced desire to eat', category: 'General' },
  { symptomName: 'Body Ache', description: 'Generalized pain throughout the body', category: 'General' },
  { symptomName: 'Weakness', description: 'Loss of physical strength', category: 'General' },

  // Respiratory
  { symptomName: 'Cough', description: 'Sudden expulsion of air from the lungs', category: 'Respiratory' },
  { symptomName: 'Sore Throat', description: 'Pain or irritation in the throat', category: 'Respiratory' },
  { symptomName: 'Runny Nose', description: 'Excess nasal drainage or discharge', category: 'Respiratory' },
  { symptomName: 'Sneezing', description: 'Involuntary expulsion of air from the nose', category: 'Respiratory' },
  { symptomName: 'Shortness of Breath', description: 'Difficulty breathing or breathlessness', category: 'Respiratory' },
  { symptomName: 'Chest Pain', description: 'Pain or discomfort in the chest area', category: 'Cardiovascular' },
  { symptomName: 'Nasal Congestion', description: 'Blocked or stuffy nose', category: 'Respiratory' },
  { symptomName: 'Wheezing', description: 'Whistling sound while breathing', category: 'Respiratory' },

  // Neurological
  { symptomName: 'Headache', description: 'Pain in the head or upper neck area', category: 'Neurological' },
  { symptomName: 'Dizziness', description: 'Feeling of lightheadedness or unsteadiness', category: 'Neurological' },
  { symptomName: 'Confusion', description: 'Inability to think clearly', category: 'Neurological' },
  { symptomName: 'Blurred Vision', description: 'Lack of sharpness of vision', category: 'Neurological' },
  { symptomName: 'Numbness', description: 'Loss of sensation or feeling', category: 'Neurological' },
  { symptomName: 'Sensitivity to Light', description: 'Eyes sensitive to bright light', category: 'Neurological' },

  // Digestive
  { symptomName: 'Nausea', description: 'Feeling of sickness with an urge to vomit', category: 'Digestive' },
  { symptomName: 'Vomiting', description: 'Forceful emptying of stomach contents', category: 'Digestive' },
  { symptomName: 'Diarrhea', description: 'Loose or watery bowel movements', category: 'Digestive' },
  { symptomName: 'Abdominal Pain', description: 'Pain in the stomach or belly area', category: 'Digestive' },
  { symptomName: 'Bloating', description: 'Feeling of fullness or swelling in the abdomen', category: 'Digestive' },
  { symptomName: 'Constipation', description: 'Difficulty or infrequent bowel movements', category: 'Digestive' },
  { symptomName: 'Heartburn', description: 'Burning sensation in the chest from acid reflux', category: 'Digestive' },

  // Musculoskeletal
  { symptomName: 'Joint Pain', description: 'Pain or discomfort in joints', category: 'Musculoskeletal' },
  { symptomName: 'Muscle Pain', description: 'Soreness or aching in muscles', category: 'Musculoskeletal' },
  { symptomName: 'Back Pain', description: 'Pain in the lower or upper back', category: 'Musculoskeletal' },
  { symptomName: 'Stiffness', description: 'Difficulty moving a joint or body part', category: 'Musculoskeletal' },
  { symptomName: 'Swelling', description: 'Enlargement or puffiness of a body part', category: 'Musculoskeletal' },

  // Skin
  { symptomName: 'Rash', description: 'Changes in skin color or texture', category: 'Skin' },
  { symptomName: 'Itching', description: 'Irritation causing a desire to scratch', category: 'Skin' },
  { symptomName: 'Skin Redness', description: 'Red or inflamed appearance of skin', category: 'Skin' },
  { symptomName: 'Dry Skin', description: 'Rough, flaky, or cracked skin', category: 'Skin' },

  // Cardiovascular
  { symptomName: 'Rapid Heartbeat', description: 'Heart beats faster than normal', category: 'Cardiovascular' },
  { symptomName: 'High Blood Pressure', description: 'Elevated pressure of blood in arteries', category: 'Cardiovascular' },

  // Other
  { symptomName: 'Insomnia', description: 'Difficulty falling or staying asleep', category: 'Other' },
  { symptomName: 'Anxiety', description: 'Feelings of worry, nervousness, or unease', category: 'Other' },
  { symptomName: 'Loss of Taste', description: 'Reduced or absent ability to taste', category: 'Other' },
  { symptomName: 'Loss of Smell', description: 'Reduced or absent ability to smell', category: 'Other' },
  { symptomName: 'Frequent Urination', description: 'Needing to urinate more often than usual', category: 'Other' },
  { symptomName: 'Excessive Thirst', description: 'Constant feeling of needing to drink water', category: 'Other' },
  { symptomName: 'Eye Redness', description: 'Red or bloodshot appearance of the eyes', category: 'Other' },
  { symptomName: 'Ear Pain', description: 'Pain in or around the ear', category: 'Other' },
];

const conditions = [
  {
    conditionName: 'Common Cold',
    symptoms: ['Runny Nose', 'Sneezing', 'Sore Throat', 'Cough', 'Nasal Congestion', 'Fatigue', 'Headache'],
    precautions: ['Rest adequately', 'Drink plenty of warm fluids', 'Use saline nasal drops', 'Gargle with warm salt water', 'Take over-the-counter cold medicine if needed'],
    description: 'A viral infection of the upper respiratory tract. Usually harmless and resolves within 7-10 days.',
    severity: 'Mild',
  },
  {
    conditionName: 'Influenza (Flu)',
    symptoms: ['Fever', 'Headache', 'Fatigue', 'Body Ache', 'Cough', 'Sore Throat', 'Chills', 'Sweating', 'Nasal Congestion'],
    precautions: ['Rest and stay home', 'Drink plenty of fluids', 'Take antiviral medication if prescribed', 'Use fever reducers like acetaminophen', 'Consult a doctor if symptoms worsen'],
    description: 'A contagious respiratory illness caused by influenza viruses. More severe than the common cold.',
    severity: 'Moderate',
  },
  {
    conditionName: 'COVID-19',
    symptoms: ['Fever', 'Cough', 'Fatigue', 'Loss of Taste', 'Loss of Smell', 'Shortness of Breath', 'Body Ache', 'Sore Throat', 'Headache', 'Diarrhea'],
    precautions: ['Isolate yourself immediately', 'Get tested for COVID-19', 'Monitor oxygen levels', 'Stay hydrated', 'Seek emergency care if breathing difficulty worsens', 'Consult a healthcare professional'],
    description: 'An infectious disease caused by the SARS-CoV-2 virus. Symptoms range from mild to severe.',
    severity: 'Severe',
  },
  {
    conditionName: 'Migraine',
    symptoms: ['Headache', 'Nausea', 'Sensitivity to Light', 'Blurred Vision', 'Dizziness', 'Vomiting'],
    precautions: ['Rest in a dark, quiet room', 'Apply cold compress to forehead', 'Take prescribed migraine medication', 'Stay hydrated', 'Avoid known triggers', 'Consult a neurologist for frequent migraines'],
    description: 'A neurological condition characterized by intense, debilitating headaches often accompanied by nausea and sensitivity to light.',
    severity: 'Moderate',
  },
  {
    conditionName: 'Gastritis',
    symptoms: ['Abdominal Pain', 'Nausea', 'Vomiting', 'Bloating', 'Loss of Appetite', 'Heartburn'],
    precautions: ['Eat smaller, more frequent meals', 'Avoid spicy and acidic foods', 'Limit alcohol and caffeine', 'Take antacids if recommended', 'Consult a gastroenterologist'],
    description: 'Inflammation of the stomach lining that can cause pain, nausea, and digestive discomfort.',
    severity: 'Mild',
  },
  {
    conditionName: 'Dengue Fever',
    symptoms: ['Fever', 'Headache', 'Body Ache', 'Joint Pain', 'Rash', 'Nausea', 'Fatigue', 'Vomiting', 'Eye Redness'],
    precautions: ['Seek immediate medical attention', 'Stay hydrated with plenty of fluids', 'Rest completely', 'Monitor platelet count', 'Avoid aspirin and ibuprofen', 'Use mosquito nets and repellents'],
    description: 'A mosquito-borne viral infection causing severe flu-like illness. Can be life-threatening in severe cases.',
    severity: 'Severe',
  },
  {
    conditionName: 'Allergic Rhinitis',
    symptoms: ['Sneezing', 'Runny Nose', 'Nasal Congestion', 'Itching', 'Eye Redness', 'Headache'],
    precautions: ['Avoid known allergens', 'Use antihistamines', 'Keep windows closed during high pollen', 'Use air purifiers', 'Rinse sinuses with saline solution'],
    description: 'An allergic response causing sneezing, runny nose, and itchy eyes triggered by allergens like pollen or dust.',
    severity: 'Mild',
  },
  {
    conditionName: 'Food Poisoning',
    symptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal Pain', 'Fever', 'Weakness', 'Loss of Appetite'],
    precautions: ['Stay hydrated with oral rehydration solutions', 'Rest your stomach for a few hours', 'Eat bland foods when ready', 'Avoid dairy and fatty foods temporarily', 'Seek medical help if symptoms persist beyond 48 hours'],
    description: 'Illness caused by consuming contaminated food or water. Usually resolves within a few days.',
    severity: 'Moderate',
  },
  {
    conditionName: 'Bronchitis',
    symptoms: ['Cough', 'Fatigue', 'Shortness of Breath', 'Chest Pain', 'Fever', 'Chills', 'Wheezing', 'Sore Throat'],
    precautions: ['Rest and avoid irritants', 'Use a humidifier', 'Drink warm fluids', 'Take cough suppressants if needed', 'Consult a doctor for persistent cough'],
    description: 'Inflammation of the bronchial tubes (airways) in the lungs, often caused by viral infections.',
    severity: 'Moderate',
  },
  {
    conditionName: 'Hypertension',
    symptoms: ['Headache', 'Dizziness', 'Shortness of Breath', 'Chest Pain', 'Blurred Vision', 'Rapid Heartbeat', 'High Blood Pressure'],
    precautions: ['Monitor blood pressure regularly', 'Reduce salt intake', 'Exercise regularly', 'Maintain a healthy weight', 'Take prescribed medications', 'Manage stress levels'],
    description: 'A condition where blood pressure is persistently elevated, increasing risk of heart disease and stroke.',
    severity: 'Severe',
  },
  {
    conditionName: 'Type 2 Diabetes',
    symptoms: ['Frequent Urination', 'Excessive Thirst', 'Fatigue', 'Blurred Vision', 'Weight Loss', 'Numbness', 'Weakness'],
    precautions: ['Monitor blood sugar levels', 'Follow a balanced diet', 'Exercise regularly', 'Take prescribed medications', 'Regular health checkups', 'Maintain healthy weight'],
    description: 'A chronic metabolic condition affecting how the body processes blood sugar (glucose).',
    severity: 'Severe',
  },
  {
    conditionName: 'Viral Fever',
    symptoms: ['Fever', 'Fatigue', 'Body Ache', 'Headache', 'Chills', 'Sweating', 'Loss of Appetite', 'Weakness'],
    precautions: ['Rest adequately', 'Stay hydrated', 'Take fever-reducing medications', 'Eat nutritious food', 'Consult a doctor if fever lasts more than 3 days'],
    description: 'A general term for fever caused by various viral infections. Usually self-limiting.',
    severity: 'Mild',
  },
  {
    conditionName: 'Pneumonia',
    symptoms: ['Cough', 'Fever', 'Shortness of Breath', 'Chest Pain', 'Fatigue', 'Chills', 'Sweating', 'Nausea'],
    precautions: ['Seek medical attention immediately', 'Complete the full course of prescribed antibiotics', 'Rest and stay hydrated', 'Use a humidifier', 'Get vaccinated for prevention'],
    description: 'An infection that inflames the air sacs in one or both lungs, which may fill with fluid.',
    severity: 'Severe',
  },
  {
    conditionName: 'Sinusitis',
    symptoms: ['Nasal Congestion', 'Headache', 'Facial Pain', 'Runny Nose', 'Cough', 'Fatigue', 'Fever'],
    precautions: ['Use steam inhalation', 'Apply warm compress on face', 'Use saline nasal spray', 'Stay hydrated', 'Consult an ENT specialist if chronic'],
    description: 'Inflammation of the sinuses causing congestion, facial pain, and headache.',
    severity: 'Mild',
  },
  {
    conditionName: 'Anxiety Disorder',
    symptoms: ['Anxiety', 'Insomnia', 'Rapid Heartbeat', 'Sweating', 'Dizziness', 'Nausea', 'Headache', 'Fatigue'],
    precautions: ['Practice deep breathing exercises', 'Engage in regular physical activity', 'Limit caffeine intake', 'Practice mindfulness and meditation', 'Seek professional counseling', 'Consider therapy or medication'],
    description: 'A mental health condition characterized by excessive worry and fear that interferes with daily activities.',
    severity: 'Moderate',
  },
  {
    conditionName: 'Arthritis',
    symptoms: ['Joint Pain', 'Stiffness', 'Swelling', 'Muscle Pain', 'Fatigue', 'Weakness'],
    precautions: ['Maintain a healthy weight', 'Exercise regularly with low-impact activities', 'Apply heat or cold therapy', 'Take anti-inflammatory medications', 'Consult a rheumatologist'],
    description: 'Inflammation of one or more joints causing pain and stiffness that can worsen with age.',
    severity: 'Moderate',
  },
  {
    conditionName: 'Urinary Tract Infection',
    symptoms: ['Frequent Urination', 'Abdominal Pain', 'Fever', 'Fatigue', 'Back Pain', 'Nausea'],
    precautions: ['Drink plenty of water', 'Take prescribed antibiotics', 'Practice good hygiene', 'Avoid holding urine for long periods', 'Consult a doctor promptly'],
    description: 'An infection in any part of the urinary system, most commonly affecting the bladder and urethra.',
    severity: 'Moderate',
  },
  {
    conditionName: 'Asthma',
    symptoms: ['Shortness of Breath', 'Wheezing', 'Cough', 'Chest Pain', 'Fatigue'],
    precautions: ['Use prescribed inhalers', 'Avoid triggers like smoke and dust', 'Monitor breathing with peak flow meter', 'Create an asthma action plan', 'Get regular checkups'],
    description: 'A chronic condition where airways narrow and swell, producing extra mucus and making breathing difficult.',
    severity: 'Moderate',
  },
  {
    conditionName: 'Eczema',
    symptoms: ['Itching', 'Rash', 'Dry Skin', 'Skin Redness', 'Swelling'],
    precautions: ['Moisturize skin regularly', 'Avoid harsh soaps and detergents', 'Use prescribed topical creams', 'Wear soft, breathable fabrics', 'Avoid scratching affected areas'],
    description: 'A condition causing the skin to become inflamed, itchy, red, and cracked.',
    severity: 'Mild',
  },
  {
    conditionName: 'Ear Infection',
    symptoms: ['Ear Pain', 'Fever', 'Headache', 'Dizziness', 'Loss of Appetite', 'Insomnia'],
    precautions: ['Apply warm compress to affected ear', 'Take pain relievers as needed', 'Keep ears dry', 'Consult an ENT specialist', 'Complete prescribed antibiotics course'],
    description: 'An infection of the middle ear, common in children but can affect adults too.',
    severity: 'Mild',
  },
  {
    conditionName: 'Malaria',
    symptoms: ['Fever', 'Chills', 'Headache', 'Sweating', 'Nausea', 'Vomiting', 'Body Ache', 'Fatigue', 'Diarrhea'],
    precautions: ['Seek immediate medical treatment', 'Take prescribed antimalarial drugs', 'Use mosquito nets and repellents', 'Stay hydrated', 'Complete the full course of treatment'],
    description: 'A life-threatening disease caused by parasites transmitted through infected mosquito bites.',
    severity: 'Severe',
  },
  {
    conditionName: 'Tension Headache',
    symptoms: ['Headache', 'Stiffness', 'Fatigue', 'Anxiety', 'Insomnia', 'Muscle Pain'],
    precautions: ['Practice stress management', 'Get regular sleep', 'Take over-the-counter pain relievers', 'Stay hydrated', 'Practice good posture', 'Consider massage therapy'],
    description: 'The most common type of headache, often related to stress, poor posture, or fatigue.',
    severity: 'Mild',
  },
  {
    conditionName: 'Conjunctivitis (Pink Eye)',
    symptoms: ['Eye Redness', 'Itching', 'Sensitivity to Light', 'Blurred Vision', 'Swelling'],
    precautions: ['Avoid touching or rubbing eyes', 'Wash hands frequently', 'Use prescribed eye drops', 'Avoid sharing towels and pillows', 'Consult an ophthalmologist'],
    description: 'An inflammation of the outer membrane of the eyeball and inner eyelid, causing redness and discharge.',
    severity: 'Mild',
  },
  {
    conditionName: 'Irritable Bowel Syndrome',
    symptoms: ['Abdominal Pain', 'Bloating', 'Diarrhea', 'Constipation', 'Nausea', 'Fatigue'],
    precautions: ['Follow a balanced diet', 'Identify and avoid trigger foods', 'Manage stress levels', 'Exercise regularly', 'Consult a gastroenterologist for treatment plan'],
    description: 'A common disorder affecting the large intestine, causing cramping, abdominal pain, and changes in bowel habits.',
    severity: 'Moderate',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding');

    // Clear existing data
    await Symptom.deleteMany();
    await Condition.deleteMany();
    console.log('Cleared existing symptoms and conditions');

    // Insert symptoms
    const createdSymptoms = await Symptom.insertMany(symptoms);
    console.log(`Seeded ${createdSymptoms.length} symptoms`);

    // Insert conditions
    const createdConditions = await Condition.insertMany(conditions);
    console.log(`Seeded ${createdConditions.length} conditions`);

    console.log('\n✅ Database seeded successfully!');
    console.log(`   ${createdSymptoms.length} symptoms across ${[...new Set(symptoms.map(s => s.category))].length} categories`);
    console.log(`   ${createdConditions.length} health conditions with precautions`);

    process.exit();
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
