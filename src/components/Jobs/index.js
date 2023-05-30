import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {BiSearch} from 'react-icons/bi'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

class Jobs extends Component {
  state = {
    profileImageUrl: '',
    profileName: '',
    profileShortBio: '',
    apiJobsList: [],
    searchValue: '',
    employeeType: [],
    minimumPackage: 0,
    isFailure: false,
    isLoadingProfile: true,
    isLoadingJobList: true,
  }

  componentDidMount = () => {
    this.profileFetching()
    this.jobListDataFetching()
  }

  profileFetching = async () => {
    this.setState({isLoadingProfile: true})
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    const data = await response.json()
    if (response.ok) {
      this.setState({
        profileImageUrl: data.profile_details.profile_image_url,
        profileName: data.profile_details.name,
        profileShortBio: data.profile_details.short_bio,
        isLoadingProfile: false,
      })
    } else {
      this.setState({isFailure: true, isLoadingProfile: false})
    }
  }

  jobListDataFetching = async () => {
    this.setState({isLoadingJobList: true})
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const {employeeType, minimumPackage, searchValue} = this.state
    const employeeTypeString = employeeType.join(',')
    const response = await fetch(
      `https://apis.ccbp.in/jobs?employment_type=${employeeTypeString}&minimum_package=${minimumPackage}&search=${searchValue}`,
      options,
    )
    const jobsListData = await response.json()
    if (response.ok) {
      const formattedData = jobsListData.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        apiJobsList: formattedData,
        isLoadingJobList: false,
      })
    } else {
      this.setState({
        isFailure: true,
        isLoadingJobList: false,
      })
    }
  }

  onChangeEmployeeType = event => {
    const {employeeType} = this.state
    if (employeeType.includes(event.target.value) === false) {
      this.setState(
        prevState => ({
          employeeType: [...prevState.employeeType, event.target.value],
        }),
        this.jobListDataFetching,
      )
    } else {
      const filterEmployeeTypeList = employeeType.filter(
        eachType => eachType !== event.target.value,
      )
      this.setState(
        {employeeType: filterEmployeeTypeList},
        this.jobListDataFetching,
      )
    }
  }

  onChangeSearch = event => {
    this.setState({searchValue: event.target.value})
  }

  onChangePackage = event => {
    this.setState(
      {minimumPackage: event.target.value},
      this.jobListDataFetching,
    )
  }

  onClickSearch = () => {
    this.jobListDataFetching()
  }

  onClickRetryButton = () => {
    this.jobListDataFetching()
  }

  render() {
    const {employmentTypesList, salaryRangesList} = this.props
    const {
      profileImageUrl,
      profileName,
      profileShortBio,
      apiJobsList,
      searchValue,
      isFailure,
      isLoadingProfile,
      isLoadingJobList,
    } = this.state

    return (
      <>
        <Header />
        <div className="jobs-main-container">
          <div className="search-bar-container-mobile">
            <input
              className="search-input"
              onChange={this.onChangeSearch}
              value={searchValue}
              type="search"
              placeholder="Search"
            />
            <button
              className="search-button"
              onClick={this.onClickSearch}
              type="button"
              data-testid="searchButton"
            >
              <BiSearch />
            </button>
          </div>
          <div className="profile-and-filter-container">
            {isLoadingProfile && (
              <div className="profile-loader-container" data-testid="loader">
                <Loader
                  type="ThreeDots"
                  color="#ffffff"
                  height="50"
                  width="50"
                />
              </div>
            )}
            {!isLoadingProfile && (
              <div className="profile-container">
                <img alt="profile" src={profileImageUrl} />
                <h1 className="profile-name">{profileName}</h1>
                <p className="profile-short-bio">{profileShortBio}</p>
              </div>
            )}
            <div className="filter-container">
              <h1 className="filter-heading">Type of Employment</h1>
              <ul className="filter-ul">
                {employmentTypesList.map(eachType => (
                  <li className="filter-item" key={eachType.employmentTypeId}>
                    <input
                      type="checkbox"
                      id={eachType.employmentTypeId}
                      value={eachType.employmentTypeId}
                      onChange={this.onChangeEmployeeType}
                    />
                    <label
                      className="filter-label"
                      htmlFor={eachType.employmentTypeId}
                    >
                      {eachType.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="filter-container">
              <h1 className="filter-heading">Salary Range</h1>
              <ul className="filter-ul">
                {salaryRangesList.map(eachRange => (
                  <li className="filter-item" key={eachRange.salaryRangeId}>
                    <input
                      type="radio"
                      name="salaryRange"
                      id={eachRange.salaryRangeId}
                      value={eachRange.salaryRangeId}
                      onChange={this.onChangePackage}
                    />
                    <label
                      className="filter-label"
                      htmlFor={eachRange.salaryRangeId}
                    >
                      {eachRange.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="search-bar-and-job-list-container">
            <div className="search-bar-container-desktop">
              <input
                className="search-input"
                onChange={this.onChangeSearch}
                value={searchValue}
                type="search"
                placeholder="Search"
              />
              <button
                className="search-button"
                onClick={this.onClickSearch}
                type="button"
                data-testid="searchButton"
              >
                <BiSearch />
              </button>
            </div>
            {isLoadingJobList && (
              <div className="loader-container">
                <div className="loader-container" data-testid="loader">
                  <Loader
                    type="ThreeDots"
                    color="#ffffff"
                    height="50"
                    width="50"
                  />
                </div>
              </div>
            )}
            {!isFailure && !isLoadingJobList && apiJobsList.length > 0 && (
              <ul className="jobs-list-ul">
                {apiJobsList.map(eachJob => (
                  <li className="job-item" key={eachJob.id}>
                    <Link className="link-component" to={`/jobs/${eachJob.id}`}>
                      <div className="company-logo-job-title-container">
                        <img
                          src={eachJob.companyLogoUrl}
                          alt="company logo"
                          className="job-list-item-company-logo"
                        />
                        <div>
                          <h1 className="job-title">{eachJob.title}</h1>
                          <div className="rating-container">
                            <p className="rating-paragraph">{eachJob.rating}</p>
                            <AiFillStar className="rating-star-icon" />
                          </div>
                        </div>
                      </div>
                      <div className="job-package-location-and-type-container">
                        <div className="job-location-and-type-container">
                          <MdLocationOn className="location-and-briefcase-icon" />
                          <p className="location-and-briefcase-text">
                            {eachJob.location}
                          </p>
                          <BsFillBriefcaseFill className="location-and-briefcase-icon" />
                          <p className="location-and-briefcase-text">
                            {eachJob.employmentType}
                          </p>
                        </div>
                        <p className="package">{eachJob.packagePerAnnum}</p>
                      </div>
                      <div className="job-item-description-container">
                        <h1 className="job-item-description-heading">
                          Description
                        </h1>
                        <p className="job-item-description-paragraph">
                          {eachJob.jobDescription}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {isFailure && (
              <div className="failure-element-container">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
                  alt="failure view"
                  className="failure-image"
                />
                <h1 className="failure-heading">Oops! Something Went wrong</h1>
                <p className="failure-paragraph">
                  We cannot seem to find the page you are looking for.
                </p>
                <button
                  className="failure-retry-button"
                  onClick={this.onClickRetryButton}
                  type="button"
                >
                  Retry
                </button>
              </div>
            )}
            {apiJobsList.length === 0 && !isFailure && !isLoadingJobList && (
              <div className="no-jobs-element-container">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                  alt="no jobs"
                  className="no-jobs-image"
                />
                <h1 className="no-jobs-heading">No Jobs Found</h1>
                <p className="no-jobs-paragraph">
                  We could not find any jobs. Try other filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
