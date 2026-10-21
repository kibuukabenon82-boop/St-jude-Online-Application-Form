const form = document.getElementById('applicationForm');
const messageBox = document.getElementById('formMessage');
const storageKey = 'stJudeApplications';

function getApplications() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch (error) {
    return [];
  }
}

function saveApplications(applications) {
  localStorage.setItem(storageKey, JSON.stringify(applications));
}

function exportApplicationsToFile() {
  const applications = getApplications();
  const data = JSON.stringify(applications, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'st-jude-applications.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

if (form && messageBox) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const applicant = Object.fromEntries(formData.entries());

    const studentName = applicant['Student name'] || applicant['studentName'] || 'Student';
    const applications = getApplications();

    applications.push({
      ...applicant,
      submittedAt: new Date().toISOString()
    });

    saveApplications(applications);
    exportApplicationsToFile();

    messageBox.textContent = `Thank you, ${studentName}! Your application has been submitted successfully and saved locally.`;
    messageBox.classList.add('visible');
    form.reset();
  });
}
