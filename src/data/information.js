export const gliomaData = {
    name: "Glioma",
    description: `Glioma is a growth of cells that starts in the brain or spinal cord. The cells in a glioma look similar to healthy brain cells called glial cells. Glial cells surround nerve cells and help them function.\n\nAs a glioma grows, it forms a mass of cells called a tumor. The tumor can grow to press on brain or spinal cord tissue and cause symptoms. Symptoms depend on which part of the brain or spinal cord is affected.\n\nThere are many types of glioma. Some grow slowly and aren't considered to be cancers. Others are considered cancerous. Another word for cancerous is malignant. Malignant gliomas grow quickly and can invade healthy brain tissue. Some types of glioma happen mostly in adults. Others happen mostly in kids.\n\nThe type of glioma you have helps your health care team understand how serious your condition is and what treatments might work best. In general, glioma treatment options include surgery, radiation therapy, chemotherapy, and others.`,
    types: ["Astrocytoma", "Ependymoma", "Glioblastoma", "Oligodendroglioma"],
    symptomsHeader: "Glioma symptoms depend on the location of the glioma. Symptoms also may depend on the type of glioma, its size and how quickly it's growing.",
    symptoms: ["Headache, particularly one that hurts the most in the morning.", "Nausea and vomiting.",
        "Confusion or a decline in brain function, such as problems with thinking and understanding information.",
        "Memory loss.",
        "Personality changes or irritability.",
        "Vision problems, such as blurred vision, double vision or loss of peripheral vision.",
        "Speech difficulties.",
        "Seizures, especially in someone who hasn't had seizures before."
    ],
    sources: [
        {
         name: "Mayo Clinic",
         link: "https://www.mayoclinic.org/diseases-conditions/glioma/symptoms-causes/syc-20350251"
        }
    ]
};


const meningioma = {
    name: "Meningioma",
    description: `A meningioma is a tumor that grows from the membranes that surround the brain and spinal cord, called the meninges. A meningioma is not a brain tumor, but it may press on the nearby brain, nerves and vessels. Meningioma is the most common type of tumor that forms in the head.\n\nMost meningiomas grow very slowly. They can grow over many years without causing symptoms. But sometimes, their effects on nearby brain tissue, nerves or vessels may cause serious disability.\n\nMeningiomas occur more often in women. They're often found at older ages. But they can happen at any age.\n\nBecause most meningiomas grow slowly, often without symptoms, they do not always need treatment right away. Instead, they may be watched over time.`,
    types: ["Convexity meningiomas", "Falcine and parasagittal meningiomas", "Intraventricular meningiomas", "Cavernous sinus meningiomas", "Cavernous sinus meningiomas", "Foramen magnum meningiomas", "Olfactory groove meningiomas", "Posterior fossa / petrous meningiomas", "Sphenoid wing meningiomas", "Spinal meningiomas", "Suprasellar meningiomas", "Tentorial meningiomas"],
    symptomsHeader: "Symptoms of a meningioma most often begin slowly. They may be hard to notice at first. Symptoms may depend on where in the brain the meningioma is. Rarely, it can be in the spine. Symptoms may include:",
    symptoms: [
        "Changes in vision, such as seeing double or blurring.", 
        "Nausea and vomiting.",
        "Headaches that are worse in the morning.",
        "Hearing loss or ringing in the ears.",
        "Memory loss.",
        "Loss of smell.",
        "Seizures.",
        "Weakness in the arms or legs.",
        "Trouble speaking."
    ],
    sources: [
        {
         name: "Mayo Clinic",
         link: "https://www.mayoclinic.org/diseases-conditions/meningioma/symptoms-causes/syc-20355643"
        },
        {name: "Mount Sinai",
        link: "https://www.mountsinai.org/care/neurosurgery/services/meningiomas/types"
        }
    ]
}

const pituitary = {
    name: "Pituitary Tumor",
    description: `Pituitary tumors are unusual growths that develop in the pituitary gland. This gland is an organ about the size of a pea. It's located behind the nose at the base of the brain. Some of these tumors cause the pituitary gland to make too much of certain hormones that control important body functions. Others can cause the pituitary gland to make too little of those hormones.\n\nMost pituitary tumors are benign. That means they are not cancer. Another name for these noncancerous tumors is pituitary adenomas. Most adenomas stay in the pituitary gland or in the tissue around it, and they grow slowly. They typically don't spread to other parts of the body.\n\nPituitary tumors can be treated in several ways. The tumor may be removed with surgery. Or its growth may be controlled with medications or radiation therapy. Sometimes, hormone levels are managed with medicine. Your health care provider may suggest a combination of these treatments. In some cases, observation — also called a 'wait-and-see' approach — may be the right choice.`,
    types: ["Functioning (These adenomas make hormones)", "Nonfunctioning (These adenomas don't make hormones)", "Macroadenomas (larger adenomas)", "Oligodendroglioma (smaller adenomas)"],
    symptomsHeader: "Pituitary tumors may not always cause symptoms and are sometimes discovered during imaging tests done for other reasons. If they are asymptomatic, treatment is often unnecessary. However, symptoms can occur if the tumor exerts pressure on the brain or nearby tissues, or if it causes hormone imbalances. These imbalances may result from the tumor producing too much of certain hormones or from large tumors interfering with the pituitary gland's normal function, causing hormone levels to drop.",
    symptoms: ["Headache.",
         "Eye problems due to pressure on the optic nerve, especially loss of side vision, also called peripheral vision, and double vision.",
        "Pain in the face, sometimes including sinus pain or ear pain.",
        "Drooping eyelid.",
        "Seizures.",
        "Nausea and vomiting.",
    ],
    sources: [
        {
         name: "Mayo Clinic",
         link: "https://www.mayoclinic.org/diseases-conditions/pituitary-tumors/symptoms-causes/syc-20350548"
        }
    ]
}

const HGG = {
    name: "High-Grade Glioma",
    description:  `A glioma is a tumor that forms in specialized glial cells in the brain or spinal cord. These non-neuronal cells support, connect and protect neurons in the central and peripheral nervous systems. Based on the type of glial cell affected, a glioma may be classified as an astrocytoma, brain stem glioma, ependymoma, oligodendroglioma or optic pathway glioma.\n\nGliomas are more often cancerous than not. Cancerous gliomas are assigned a grade ranging from 1 through 4 based on their growth pattern and cellular appearance when viewed under a microscope. Grades 1 and 2 are low-grade gliomas, which usually grow slowly and can often be effectively treated. Grades 3 and 4 are high-grade gliomas, which tend to be more aggressive. If left untreated, a low-grade glioma can progress into a high-grade glioma.`,
    causes: "Sometimes, high doses of radiation therapy can cause high-grade gliomas, but the reason for most high-grade gliomas in children is not known. Although doctors continue their research to understand what causes the tumors to occur, so far there have been few reliable findings. Genetic causes are rare, and these tumors are not believed to be linked to anything in the environment.",
    symptoms: [
        "Severe headaches",
        "Seizures that are not easily controlled with medication",
        "Progressive neurological deficits, such as loss of coordination",
        "Personality or behavioral changes",
        "Cognitive decline",
        "Visual disturbances"
    ],
    sources: [
        {
         name: "Moffitt Cancer Center",
         link: "https://www.moffitt.org/cancers/low-grade-glioma/symptoms/"
        },
        {
            name: "Cincinnati Children's Hospital",
            link: "https://www.cincinnatichildrens.org/health/h/high-grade-gliomas"
        }
    ]
}

const LGG = {
    name: "Low-Grade Glioma",
    description:  `A glioma is a tumor that forms in specialized glial cells in the brain or spinal cord. These non-neuronal cells support, connect and protect neurons in the central and peripheral nervous systems. Based on the type of glial cell affected, a glioma may be classified as an astrocytoma, brain stem glioma, ependymoma, oligodendroglioma or optic pathway glioma.\n\nGliomas are more often cancerous than not. Cancerous gliomas are assigned a grade ranging from 1 through 4 based on their growth pattern and cellular appearance when viewed under a microscope. Grades 1 and 2 are low-grade gliomas, which usually grow slowly and can often be effectively treated. Grades 3 and 4 are high-grade gliomas, which tend to be more aggressive. If left untreated, a low-grade glioma can progress into a high-grade glioma.`,
    causes: "In general, we don’t know what causes low grade gliomas. If your brain has been exposed to radiation in the past, you may be more likely to develop a brain tumor. Scientists have looked at other possible causes such as aspartame (Nutrasweet), cell phones, and power lines, but no one has been able to show that any of these clearly cause brain tumors.",
    symptoms: [
        "Headaches",
        "Loss of balance",
        "Numbness or muscle weakness", 
        "especially on one side of the body",
        "Difficulty walking",
        "Loss of peripheral vision",
        "Difficulty speaking and understanding speech",
        "Dizzy spells and seizures"
    ],
    sources: [
        {
         name: "Moffitt Cancer Center",
         link: "https://www.moffitt.org/cancers/low-grade-glioma/symptoms/"
        },
        {
            name: "University of Rochester Medical Center",
            link: "https://www.urmc.rochester.edu/neurosurgery/services/brain-spinal-tumor/conditions/low-grade-glioma.aspx"
        }
    ]
}


export const gradesData = {
    LGG,
    HGG
}

export const tumorData = {
    glioma: gliomaData,
    meningioma,
    pituitary
}