export function generateFallbackCase({
  scenario,
  difficulty = 'Medium',
  category = 'Custom',
  investigationStyle = 'Realistic',
  evidenceTypes = ['Messages', 'CCTV', 'Witness Statements', 'Forensic Reports'],
}) {
  const scenarioShort = scenario.slice(0, 80);

  const isTheft = /theft|diamond|painting|stolen|vault|robbery|jewel|cash/i.test(scenario);
  const isMurder = /murder|kill|dead|body|poison|homicide|stab|shot/i.test(scenario);

  const title = isMurder
    ? `The Midnight Silence: Investigation of ${scenario.slice(0, 30)}...`
    : isTheft
    ? `The Cipher Heist: Case of ${scenario.slice(0, 30)}...`
    : `Operation Enigma: Incident at ${scenario.slice(0, 30)}...`;

  const suspects = [
    {
      id: 'suspect_01',
      name: 'Victoria Vance',
      age: 38,
      occupation: 'Senior Operations Director',
      relationship: 'Keyholder & Event Coordinator',
      profileDescription: 'Polished, meticulous, and visibly stressed under questioning. Wears designer suits and glances frequently at her wristwatch.',
      publicMotive: 'Facing severe corporate audit and heavy personal debts.',
      publicAlibi: 'Claims she was inside Conference Room B reviewing final budget sheets between 20:00 and 21:30.',
      privateFacts: ['Transferred $85,000 to an offshore escrow account 24 hours before the incident.'],
      isCulprit: false,
    },
    {
      id: 'suspect_02',
      name: 'Julian Sterling',
      age: 44,
      occupation: 'Head of Security & Surveillance',
      relationship: 'Overseer of security feeds and physical locks',
      profileDescription: 'Former military contractor with sharp instincts and guarded body language. Speaks in brief, clipped sentences.',
      publicMotive: 'Had his promotion blocked last month and had complete administrative access to camera loops.',
      publicAlibi: 'States he was conducting routine perimeter patrol on the East Wing grounds.',
      privateFacts: ['Possessed an override keycard coded with root clearance, which logged entry at 20:47.'],
      isCulprit: true, // The canonical culprit!
    },
    {
      id: 'suspect_03',
      name: 'Elena Rostova',
      age: 29,
      occupation: 'Lead Archivist & Curator',
      relationship: 'Custodian of records and high-value catalog items',
      profileDescription: 'Quiet academic with ink-stained fingers and an encyclopedic memory of item serial numbers and lock mechanisms.',
      publicMotive: 'Fiercely opposed the exhibition and argued publicly with the victim/director earlier that morning.',
      publicAlibi: 'Claims she was in the restoration laboratory cataloging fragile manuscripts.',
      privateFacts: ['Her duplicate master key was reported lost two weeks ago but never revoked.'],
      isCulprit: false,
    },
    {
      id: 'suspect_04',
      name: 'Marcus Brody',
      age: 51,
      occupation: 'Chief Facilities Engineer',
      relationship: 'Maintenance manager with access to ventilation and power circuits',
      profileDescription: 'Weathered veteran technician who knows every crawlspace, fuse box, and blind spot on the property.',
      publicMotive: 'Pending contract termination due to planned automated system upgrades.',
      publicAlibi: 'Insists he was resetting the auxiliary HVAC blower in the sub-basement generator room.',
      privateFacts: ['Smelled of ozone and lithium grease when questioned by responding officers.'],
      isCulprit: false,
    },
  ];

  if (difficulty === 'Hard') {
    suspects.push({
      id: 'suspect_05',
      name: 'Damian Cross',
      age: 33,
      occupation: 'Private Auditor & Security Inspector',
      relationship: 'External consultant brought in to evaluate vulnerabilities',
      profileDescription: 'Charming, calculating, and always carrying an encrypted laptop.',
      publicMotive: 'Secretly brokering confidential operational intel to competing private syndicates.',
      publicAlibi: 'Claims he was in his hotel suite conducting remote server security diagnostics.',
      privateFacts: ['His cell phone pinged a cell tower 300 meters from the incident scene at 21:05.'],
      isCulprit: false,
    });
  }

  const evidence = [
    {
      id: 'evd_01',
      type: 'message',
      title: 'Recovered Messaging Thread: Sterling & Vance',
      description: 'Extracted encrypted chat thread from Julian Sterling’s secondary cellular device.',
      timestamp: '2026-10-24T20:15:00Z',
      content: {
        participants: ['Julian Sterling (Head of Security)', 'Victoria Vance (Director)'],
        messages: [
          { sender: 'Julian Sterling', time: '20:12', text: 'Perimeter is secure. Are you staying in Conf B all evening?' },
          { sender: 'Victoria Vance', time: '20:14', text: 'Yes. The auditors want the spreadsheets before midnight. Don’t disturb me unless critical.' },
          { sender: 'Julian Sterling', time: '20:16', text: 'Understood. Looping Sector 4 feeds for routine recalibration at 20:45.' },
          { sender: 'Victoria Vance', time: '20:17', text: 'Make it quick. Any glitch triggers the board’s notification.' },
        ],
      },
      relatedSuspectIds: ['suspect_01', 'suspect_02'],
      relatedEvidenceIds: ['evd_02'],
      hiddenSignificance: 'Sterling intentionally coordinated the camera loop timing right when he knew Vance was locked in Conf B.',
    },
    {
      id: 'evd_02',
      type: 'cctv',
      title: 'Corridor CCTV Feed: Sector 4 Hallway',
      description: 'Camera recording from the secure corridor leading directly to the primary vault room.',
      timestamp: '2026-10-24T20:40:00Z',
      content: {
        cameraId: 'CAM-SEC-04',
        location: 'West Vault Gallery Corridor',
        timeRange: '20:30:00 - 21:15:00',
        observations: [
          { time: '20:35:12', event: 'Elena Rostova passes through corridor carrying catalog binder, heading toward Archive Lab.' },
          { time: '20:45:00', event: 'Camera screen glitches; timestamp freezes displaying 20:45:00 static pattern for exactly 9 minutes.' },
          { time: '20:54:18', event: 'Live feed resumes. A figure in standard security tactical jacket exits vault corridor heading south.' },
          { time: '21:02:40', event: 'Marcus Brody enters frame holding multimeter, inspects wall junction box, and walks toward basement.' },
        ],
      },
      relatedSuspectIds: ['suspect_02', 'suspect_03', 'suspect_04'],
      relatedEvidenceIds: ['evd_01', 'evd_04'],
      hiddenSignificance: 'The 9-minute frozen loop was manually triggered from the central security desk, and the exiting figure wore standard security tactical attire.',
    },
    {
      id: 'evd_03',
      type: 'witness',
      title: 'Formal Statement: Dr. Elena Rostova',
      description: 'Recorded interrogation statement taken at 22:30 by detective team.',
      timestamp: '2026-10-24T22:30:00Z',
      content: {
        witnessName: 'Elena Rostova',
        witnessRole: 'Lead Archivist',
        credibilityScore: 'High (Verified by corroborating timestamp)',
        statement: 'I was in the lab until about 21:15. While walking down the archive ramp at around 20:50, I heard the distinctive magnetic buzzer of the vault doors opening. There is only one override keycard that bypasses the dual-key requirement, and Julian Sterling carries it on his tactical belt at all times.',
      },
      relatedSuspectIds: ['suspect_02', 'suspect_03'],
      relatedEvidenceIds: ['evd_02'],
      hiddenSignificance: 'Confirms vault opened at 20:50 during the camera blackout using the master override keycard held by Julian Sterling.',
    },
    {
      id: 'evd_04',
      type: 'forensic',
      title: 'Forensic Keycard Terminal Analysis',
      description: 'Digital audit log extracted from the electronic magnetic strike lock on the vault access portal.',
      timestamp: '2026-10-24T23:10:00Z',
      content: {
        reportId: 'FOR-CYBER-884',
        examinedSystem: 'Omicron-7 Dual Electronic Access Controller',
        findings: [
          'Terminal record #1092 at 20:47:11: Emergency Master Override Keycard #007 scanned and accepted.',
          'Keycard #007 is hardware-assigned exclusively to: Julian Sterling.',
          'No biometric failure or brute-force attempts recorded.',
          'Physical fingerprint matching right index of Julian Sterling found on outer bezel of terminal keypad.',
        ],
        labTechnician: 'Det. Inspector S. Zhao (Digital Forensics Unit)',
      },
      relatedSuspectIds: ['suspect_02'],
      relatedEvidenceIds: ['evd_02', 'evd_03'],
      hiddenSignificance: 'Irrefutable physical and digital proof that Julian Sterling’s assigned keycard and thumbprint activated the lock during the camera outage.',
    },
    {
      id: 'evd_05',
      type: 'document',
      title: 'Maintenance Log: Sub-Basement Electrical',
      description: 'Logbook recovered from facilities workshop bench.',
      timestamp: '2026-10-24T21:45:00Z',
      content: {
        documentType: 'Facilities Work Order & Sign-in Sheet',
        author: 'Marcus Brody',
        excerpt: '20:15 - Initiated manual flush of HVAC compressor 3. 20:45 - Power dip detected on West Wing feeder line; verified backup UPS engaged. 21:00 - Restored voltage calibration; system nominal.',
        notes: 'Marcus Brody’s presence in the sub-basement is corroborated by power load logs and telemetry sensors.',
      },
      relatedSuspectIds: ['suspect_04'],
      relatedEvidenceIds: ['evd_02'],
      hiddenSignificance: 'Completely eliminates Marcus Brody by proving his hands-on presence on the industrial electrical grid throughout the critical window.',
    },
    {
      id: 'evd_06',
      type: 'photograph',
      title: 'Crime Scene Photo: Vault Floor Marker #3',
      description: 'High-resolution scene photograph taken immediately upon discovery.',
      timestamp: '2026-10-24T22:00:00Z',
      content: {
        caption: 'Vault threshold showing dust pattern and footwear impression.',
        visualDetails: 'Clear imprint of Vibram-pattern tactical sole (size 11.5) in fine drywall dust near display pedestal. Matches standard issue Bates security tactical boots worn by the security team.',
        annotations: [
          'Tactical boot print size 11.5 matches Julian Sterling (worn on night of incident).',
          'Victoria Vance wore designer heels (size 7).',
          'Elena Rostova wore flat rubber sneakers (size 6.5).',
        ],
      },
      relatedSuspectIds: ['suspect_02', 'suspect_01', 'suspect_03'],
      relatedEvidenceIds: ['evd_04'],
      hiddenSignificance: 'Eliminates Vance and Rostova based on physical shoe impression size and tread design, matching Sterling.',
    },
    {
      id: 'evd_07',
      type: 'location',
      title: 'Executive Wing Electronic Turnstile Records',
      description: 'Automated badge scans for the administrative corridor and Conference Room B.',
      timestamp: '2026-10-24T21:35:00Z',
      content: {
        area: 'Executive Suite - 3rd Floor',
        accessLogs: [
          { timestamp: '19:55:04', person: 'Victoria Vance', status: 'Badge In - Conf Room B' },
          { timestamp: '20:30:19', person: 'Victoria Vance', status: 'Motion Sensor Active in Conf B' },
          { timestamp: '21:05:42', person: 'Victoria Vance', status: 'Motion Sensor Active in Conf B' },
          { timestamp: '21:28:11', person: 'Victoria Vance', status: 'Badge Out - Conf Room B' },
        ],
      },
      relatedSuspectIds: ['suspect_01'],
      relatedEvidenceIds: ['evd_01'],
      hiddenSignificance: 'Corroborates Victoria Vance’s alibi, proving she remained in Conference Room B during the entire window.',
    },
  ];

  const timeline = [
    {
      time: '19:55',
      label: 'Vance Enters Conference Room',
      description: 'Victoria Vance enters Conference Room B to finalize audit documentation.',
      suspectsInvolved: ['suspect_01'],
    },
    {
      time: '20:15',
      label: 'Encrypted Message Exchange',
      description: 'Sterling messages Vance confirming perimeter status and camera recalibration schedule.',
      suspectsInvolved: ['suspect_01', 'suspect_02'],
    },
    {
      time: '20:35',
      label: 'Curator Movement',
      description: 'Elena Rostova passes through Sector 4 corridor toward the restoration archive.',
      suspectsInvolved: ['suspect_03'],
    },
    {
      time: '20:45',
      label: 'Surveillance Blind Spot Commences',
      description: 'CCTV feed CAM-SEC-04 freezes on a static loop for 9 minutes.',
      suspectsInvolved: ['suspect_02'],
    },
    {
      time: '20:47',
      label: 'Vault Override Keycard Logged',
      description: 'Master Override Keycard #007 is scanned at vault electronic terminal.',
      suspectsInvolved: ['suspect_02'],
    },
    {
      time: '20:54',
      label: 'Figure Seen Exiting Vault Corridor',
      description: 'Surveillance feed restores, showing tactical security jacket exiting southward.',
      suspectsInvolved: ['suspect_02'],
    },
    {
      time: '21:28',
      label: 'Incident Discovered',
      description: 'Alarm tripped when perimeter check team discovers the vault door ajar.',
      suspectsInvolved: [],
    },
  ];

  const canonicalSolution = {
    culpritId: 'suspect_02',
    culpritName: 'Julian Sterling',
    motive: 'Julian Sterling leveraged his upcoming termination and resentments over blocked promotion to execute a premeditated breach. Facing substantial outside financial debts, he pre-arranged the extraction during the planned camera loop blackout.',
    method: 'At 20:45, Sterling deliberately froze the Sector 4 surveillance camera feed using his administrative desk controls. Armed with his exclusive Emergency Master Override Keycard #007, he unlocked the vault door at 20:47, leaving his right index fingerprint on the lock bezel and size 11.5 tactical boot impressions in the drywall dust. He concealed the target item inside his tactical security vest and exited the corridor just as the camera feed returned at 20:54.',
    timeline: [
      { time: '20:15', event: 'Checked Vance’s location to ensure she was isolated in Conference Room B.' },
      { time: '20:45', event: 'Activated 9-minute frozen loop on CAM-SEC-04.' },
      { time: '20:47', event: 'Scanned Master Override Keycard #007 to enter vault.' },
      { time: '20:50', event: 'Magnetic door buzzer heard by witness Elena Rostova.' },
      { time: '20:54', event: 'Exited corridor in tactical security jacket with stolen asset.' },
    ],
    explanation: 'The culprit is unequivocally Head of Security Julian Sterling. First, CCTV feed Sector 4 froze on an artificial static loop between 20:45 and 20:54, a manipulation only possible with central security desk administrative credentials. Second, forensic examination of the vault magnetic strike lock proved that Emergency Master Keycard #007 was swiped at 20:47, accompanied by Sterling’s right index fingerprint. Third, the tactical boot tread (size 11.5) matches Sterling’s standard issue footwear and conclusively rules out Victoria Vance (size 7 heels) and Elena Rostova (size 6.5 flat sneakers). Finally, sensor logs verify Victoria Vance was in Conference Room B, and electrical logs corroborate Marcus Brody in the generator room throughout the incident.',
    keyClues: [
      'Digital forensic audit (FOR-CYBER-884) proving Master Keycard #007 and Sterling’s fingerprint opened the vault lock at 20:47.',
      'CCTV feed froze for 9 minutes via internal security desk controls, showing a tactical security jacket exiting upon feed restoration.',
      'Size 11.5 tactical boot tread in drywall dust matching Sterling and eliminating all other suspects.',
      'Corroborating witness testimony from Elena Rostova hearing the override buzzer at 20:50.',
    ],
    innocentSuspectExplanations: [
      {
        suspectId: 'suspect_01',
        whyEliminated: 'Executive turnstile badge logs and continuous infrared motion sensors confirm Victoria Vance was locked inside Conference Room B from 19:55 until 21:28.',
      },
      {
        suspectId: 'suspect_03',
        whyEliminated: 'Elena Rostova was seen on camera entering the archive lab at 20:35, provided the corroborating statement regarding the 20:50 buzzer, and her shoe size (6.5) does not match the scene footwear impressions.',
      },
      {
        suspectId: 'suspect_04',
        whyEliminated: 'Marcus Brody’s active voltage multimeter adjustments and facilities log telemetry establish his physical presence in the sub-basement generator room from 20:15 through 21:00.',
      },
    ],
  };

  return {
    case: {
      title,
      category,
      difficulty,
      location: 'The Fictional Vanguard Estate & Vault Complex',
      incidentDate: '2026-10-24',
      incidentSummary: `Investigation initiated following scenario: "${scenarioShort}". Multiple high-value assets compromised under suspicious circumstances.`,
      background: `The incident occurred during an operational shift change. Tension had been mounting among senior staff regarding impending corporate structural changes, financial audits, and security overhauls.`,
      objectives: [
        'Unmask the true culprit responsible for the breach',
        'Cross-reference electronic keycard, CCTV, and witness evidence',
        'Expose the false alibi and identify the critical contradiction',
      ],
    },
    suspects,
    canonicalSolution,
    evidence,
    timeline,
  };
}
