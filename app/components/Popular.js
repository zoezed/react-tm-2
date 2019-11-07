import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle } from 'react-icons/fa'
import Card from './Card'
import Loading from './Loading'
import Tooltip from './Tooltip'

function LanguagesNav({ selected, onUpdateLanguage }) {
    const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']
        return (
            <ul className='flex-center'>
                {languages.map((language) => (
                    <li key={language}>
                        <button
                            className='btn-clear nav-link'
                            style={language === selected ? { color: 'rgb(187, 46, 31' } : null}
                            onClick={()=> onUpdateLanguage(language)}
                        >
                        {language}
                        </button>
                    </li>
                ))}
            </ul>
        ) 
}

LanguagesNav.propTypes = {
    selected: PropTypes.string.isRequired,
    onUpdateLanguage: PropTypes.func.isRequired
}

function ReposGrid({ repos }) {
    return (
        <ul className='grid space-around'>
            {repos.map((repo, index) => {
                const { name, owner, html_url, stargazers_count, forks, open_issues } = repo
                const { login, avatar_url } = owner
                    
                return (                    
                    <li key='html_url'>
                        <Card
                        header={`#${index + 1}`}
                        avatar={avatar_url}
                        href={html_url}
                        name={login}
                    
                        >                   
                        <ul className='card-list'>
                            <li>
                                <Tooltip text="Github user name">
                                    <FaUser color='rgb(255, 191, 116)' size={22}></FaUser>
                                    <a href={`https://github.com/${login}`}>
                                        {login}
                                    </a>
                                 </Tooltip>
                            </li>
                            <li>
                                <FaStar color='rgb(255, 215, 0)' size={22}></FaStar>
                                {stargazers_count.toLocaleString()} stars
                            </li>
                            <li>
                                <FaCodeBranch color='rgb(129, 195, 245)' size={22}></FaCodeBranch>
                                {forks.toLocaleString()} stars
                            </li>
                            <li>
                                <FaExclamationTriangle color='rgb(241, 138, 147)' size={22}></FaExclamationTriangle>
                                {open_issues.toLocaleString()} open issues   
                            </li>
                            </ul>
                            </Card>
                    </li>
                )
            })}
        </ul>
    )
}

ReposGrid.propTypes = {
    repos: PropTypes.array.isRequired
}

export default class Popular extends Component {
    state = {
            selectedLan: 'All',
            repos: {},
            error: null
    }

    componentDidMount() {
        this.updateLanguage(this.state.selectedLan)
    }

    updateLanguage = (selectedLan) => {
        this.setState({
            selectedLan,
            error: null,            
        })

        if (!this.state.repos[selectedLan]) {
            fetchPopularRepos(selectedLan)
                .then((data) => {
                    this.setState(({ repos }) => ({
                        repos: {
                            ...repos,
                            [selectedLan]: data
                        }
                    }))
                })
                .catch(() => {
                    console.warn('Error fetching repos', error)
                    this.setState({
                        error: 'There was an error fetching the repositories'
                    })
                })
        }
            
    }

    isLoading = () => {
        const { selectedLan, repos, error } = this.state

        return !repos[selectedLan] && error === null
    }
    
    render() {
        const { selectedLan, repos, error } = this.state
            
        return (
            < React.Fragment >
                <LanguagesNav 
                    selected={selectedLan}
                    onUpdateLanguage = {this.updateLanguage}

                />

                {this.isLoading() && <Loading text='Fetching popular repositories'/>}

                {error && <p className='error center-txt'>Error</p>}

                {repos[selectedLan] && <ReposGrid repos={repos[selectedLan]} />}
        
            </React.Fragment>            
        )

        

        
    }
}

