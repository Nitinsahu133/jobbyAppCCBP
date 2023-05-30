import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'
import './index.css'

class JobDetail extends Component {
  state = {
    jobDetail: {},
    jobSkills: [],
    lifeAtCompany: {},
    similarJobs: [],
    isFailure: false,
    isLoading: true,
  }

  componentDidMount = () => {
    this.callApiJobDetails()
  }

  callApiJobDetails = async () => {
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const options = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    const data = await response.json()

    if (response.ok) {
      const formattedData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
        similarJobs: data.similar_jobs.map(eachJob => ({
          companyLogoUrl: eachJob.company_logo_url,
          employmentType: eachJob.employment_type,
          id: eachJob.id,
          jobDescription: eachJob.job_description,
          location: eachJob.location,
          rating: eachJob.rating,
          title: eachJob.title,
        })),
        skills: data.job_details.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        lifeAtCompany: {
          imageUrl: data.job_details.life_at_company.image_url,
          description: data.job_details.life_at_company.description,
        },
      }
      this.setState({
        jobDetail: formattedData,
        jobSkills: formattedData.skills,
        lifeAtCompany: formattedData.lifeAtCompany,
        similarJobs: formattedData.similarJobs,
        isLoading: false,
      })
    } else {
      this.setState({isFailure: true, isLoading: false})
    }
  }

  render() {
    const {
      jobDetail,
      jobSkills,
      lifeAtCompany,
      similarJobs,
      isFailure,
      isLoading,
    } = this.state

    return (
      <>
        {isLoading && (
          <div>
            <div className="loader-container" data-testid="loader">
              <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
            </div>
          </div>
        )}
        {!isLoading && (
          <>
            {isFailure && (
              <div>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
                  alt="failure view"
                />
                <h1 className="failure-heading">Oops! Something Went wrong</h1>
                <p className="failure-paragraph">
                  We cannot seem to find the page you are looking for.
                </p>
                <button onClick={this.callApiJobDetails} type="button">
                  Retry
                </button>
              </div>
            )}
            {!isFailure && (
              <>
                <Header />
                <div className="jobs-details-main-container">
                  <div className="about-job-container">
                    <div className="company-logo-job-title-container">
                      <img
                        className="job-details-company-logo"
                        src={jobDetail.companyLogoUrl}
                        alt="job details company logo"
                        key={jobDetail.title}
                      />
                      <div>
                        <h1 className="job-title">{jobDetail.title}</h1>
                        <div className="rating-container">
                          <p className="rating-paragraph">{jobDetail.rating}</p>
                          <AiFillStar className="rating-star-icon" />
                        </div>
                      </div>
                    </div>
                    <div className="job-package-location-and-type-container">
                      <div className="job-location-and-type-container">
                        <MdLocationOn className="location-and-briefcase-icon" />
                        <p className="location-and-briefcase-text">
                          {jobDetail.location}
                        </p>
                        <BsFillBriefcaseFill className="location-and-briefcase-icon" />
                        <p className="location-and-briefcase-text">
                          {jobDetail.employmentType}
                        </p>
                      </div>
                      <p className="package">{jobDetail.packagePerAnnum}</p>
                    </div>
                    <div>
                      <div className="description-and-visit-link-container">
                        <h1 className="job-item-description-heading">
                          Description
                        </h1>
                        <a
                          className="visit-link"
                          href={jobDetail.companyWebsiteUrl}
                        >
                          <p className="visit-link-text">Visit</p>
                          <BiLinkExternal className="visit-link-icon" />
                        </a>
                      </div>
                      <p className="job-item-description-paragraph">
                        {jobDetail.jobDescription}
                      </p>
                    </div>
                    <h1 className="skill-heading">Skills</h1>
                    <ul className="skills-ul">
                      {jobSkills.map(eachSkill => (
                        <li className="skill-item" key={eachSkill.name}>
                          <img
                            className="skill-image"
                            src={eachSkill.imageUrl}
                            alt={eachSkill.name}
                          />
                          <p className="skill-text">{eachSkill.name}</p>
                        </li>
                      ))}
                    </ul>
                    <div>
                      <h1 className="life-at-company-heading">
                        Life at Company
                      </h1>
                      <div className="life-at-company-description-and-image-container">
                        <p className="life-at-company-description">
                          {lifeAtCompany.description}
                        </p>
                        <img
                          className="life-at-company-image"
                          src={lifeAtCompany.imageUrl}
                          alt="life at company"
                        />
                      </div>
                    </div>
                  </div>
                  <h1 className="similar-jobs-main-heading">Similar Jobs</h1>
                  <ul className="similar-jobs-ul">
                    {similarJobs.map(eachJob => (
                      <li key={eachJob.id} className="similar-job-item">
                        <Link
                          className="link-component"
                          to={`/jobs/${eachJob.id}`}
                        >
                          <div className="job-item-image-and-heading-container">
                            <img
                              className="similar-job-item-company-logo"
                              src={eachJob.companyLogoUrl}
                              alt="similar job company logo"
                            />
                            <div>
                              <h1 className="similar-job-item-title">
                                {eachJob.title}
                              </h1>
                              <div className="similar-job-item-rating-container">
                                <p className="similar-job-item-rating-text">
                                  {eachJob.rating}
                                </p>
                                <AiFillStar className="similar-job-item-rating-icon" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <h1 className="similar-job-item-description-heading">
                              Description
                            </h1>
                            <p className="similar-job-item-description">
                              {eachJob.jobDescription}
                            </p>
                          </div>
                          <div className="similar-job-item-location-and-employee-type-container">
                            <MdLocationOn className="similar-job-item-location-and-employee-type-icon" />
                            <p className="similar-job-item-location-and-employee-type-text">
                              {eachJob.location}
                            </p>
                            <BsFillBriefcaseFill className="similar-job-item-location-and-employee-type-icon" />
                            <p className="similar-job-item-location-and-employee-type-text">
                              {eachJob.employmentType}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </>
        )}
      </>
    )
  }
}

export default JobDetail
