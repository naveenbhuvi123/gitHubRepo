import {Component} from 'react'
import Loader from 'react-loader-spinner'
import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'
import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class GithubPopularRepos extends Component {
  state = {
    currentLanguage: languageFiltersData[0].id,
    reposList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getRepoDetails()
  }

  getRepoDetails = async () => {
    const {currentLanguage} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = `https://apis.ccbp.in/popular-repos?language=${currentLanguage}`
    const repositoriesResponse = await fetch(url)
    if (repositoriesResponse.ok) {
      const jsonResponse = await repositoriesResponse.json()
      const updatedRepositories = jsonResponse.popular_repos.map(
        eachRepository => ({
          id: eachRepository.id,
          name: eachRepository.name,
          avatarUrl: eachRepository.avatar_url,
          forksCount: eachRepository.forks_count,
          issuesCount: eachRepository.issues_count,
          starsCount: eachRepository.stars_count,
        }),
      )
      console.log(updatedRepositories)
      this.setState({
        apiStatus: apiStatusConstants.success,
        reposList: updatedRepositories,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  changeActiveBTn = id => {
    this.setState({currentLanguage: id}, this.getRepoDetails)
  }

  renderInProgressView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        className="failure-img"
        alt="failure view"
      />
      <h1 className="failure-txt">Something went wrong</h1>
    </div>
  )

  renderRepositoryItem = () => {
    const {reposList} = this.state
    return (
      <ul className="reposList">
        {reposList.map(eachRepo => (
          <RepositoryItem repoDetails={eachRepo} key={eachRepo.id} />
        ))}
      </ul>
    )
  }

  renderRepositoryItems = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderRepositoryItem()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderInProgressView()
      default:
        return null
    }
  }

  render() {
    const {currentLanguage} = this.state
    return (
      <div className="repos-app">
        <h1 className="main-heading">Popular</h1>
        <ul className="language-list">
          {languageFiltersData.map(eachItem => (
            <LanguageFilterItem
              itemDetails={eachItem}
              key={eachItem.id}
              isActive={currentLanguage === eachItem.id}
              changeActiveBtn={this.changeActiveBTn}
            />
          ))}
        </ul>
        <div>{this.renderRepositoryItems()}</div>
      </div>
    )
  }
}

export default GithubPopularRepos
