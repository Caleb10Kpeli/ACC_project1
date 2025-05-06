// Initialize variables
let jobs = [];
let activeFilters = [];

// Load data
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    jobs = data;
    renderJobs();
  })
  .catch(error => console.error("Error loading data:", error));

// Render job listings
function renderJobs(jobsToRender = jobs) {
  const listings = document.querySelector('.job-listings');
  listings.innerHTML = jobsToRender.map(job => `
    <div class="job-card ${job.featured ? 'featured' : ''}">
      <img src="${job.logo}" alt="${job.company}" class="company-logo">
      <div class="job-details">
        <div class="company">
          <span>${job.company}</span>
          ${job.new ? '<span class="new">NEW!</span>' : ''}
          ${job.featured ? '<span class="featured-tag">FEATURED</span>' : ''}
        </div>
        <h3>${job.position}</h3>
        <div class="meta">
          <span>${job.postedAt}</span>
          <span>• ${job.contract}</span>
          <span>• ${job.location}</span>
        </div>
      </div>
      <div class="tags">
        <span>${job.role}</span>
        <span>${job.level}</span>
        ${job.languages.map(lang => `<span>${lang}</span>`).join('')}
        ${job.tools.map(tool => `<span>${tool}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// Filter jobs
function filterJobs() {
  if (activeFilters.length === 0) {
    renderJobs();
    return;
  }

  const filteredJobs = jobs.filter(job => {
    const tags = [job.role, job.level, ...job.languages, ...job.tools];
    return activeFilters.every(filter => tags.includes(filter));
  });
  renderJobs(filteredJobs);
}

// Filter management
function renderFilters() {
  const filtersContainer = document.getElementById('active-filters');
  filtersContainer.innerHTML = activeFilters.map(filter => `
    <div class="filter-tag">
      ${filter}
      <button onclick="removeFilter('${filter}')">✕</button>
    </div>
  `).join('');

  document.querySelector('.filter-bar').classList.toggle('hidden', activeFilters.length === 0);
}

function addFilter(filter) {
  if (!activeFilters.includes(filter)) {
    activeFilters.push(filter);
    renderFilters();
    filterJobs();
  }
}

function removeFilter(filter) {
  activeFilters = activeFilters.filter(f => f !== filter);
  renderFilters();
  filterJobs();
}

// Event listeners
document.getElementById('clear-btn').addEventListener('click', () => {
  activeFilters = [];
  renderFilters();
  filterJobs();
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('tags') || e.target.parentElement.classList.contains('tags')) {
    const tag = e.target.textContent;
    addFilter(tag);
  }
});