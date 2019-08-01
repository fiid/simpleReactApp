import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      isLoading: true,
      index: 0,
      resultCount: 0
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
    this.doApiRequest(0)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this))
  }

  handleKeyDown(key) {
    if(key.code === 'ArrowRight') {
      this.nextSlide()
    } else if(key.code === 'ArrowLeft') {
      this.previousSlide()
    }
  }

  doApiRequest(index) {
    if (index < this.state.images.length) {
      return
    }

    this.setState({isLoading:true})

    const page = (index / 10) + 1
    console.log("loading page " + page)
    fetch('https://api.unsplash.com/search/photos?client_id=6bb5bb78cfde81736048d37f2d3399d5024a6a5be277ad88a4b1a366a5e4f77f&query=japan&page=' + page)
      .then(response => response.json())
      .then(data => {
        const imgUrls = data.results.map(result => { return result.urls.regular })
        this.setState(prevState => ({
          images: [...prevState.images, ...imgUrls],
          isLoading: false,
          resultCount:data.total
        }))
      })
  }

  render() {
    return (
      <div className="App">
        <h1>Super Unsplash!</h1>
        <div>
          <button disabled={this.state.isLoading} onClick={this.previousSlide}>Previous</button>
          <button disabled={this.state.isLoading} onClick={this.nextSlide}>Next</button>
        </div>

        {!this.state.isLoading || (
          <h2>Loading...</h2>
        )}
        {this.state.isLoading || (
          <img src={this.state.images[this.state.index]} />
        )}


      </div>
    )
  }

  nextSlide = () => {
    this.setState((state) => {
      if (this.state.index < this.state.resultCount) {
        return {index: this.state.index + 1}
      }
    })
    this.doApiRequest(this.state.index + 1)
  }

  previousSlide = () => {
    this.setState((state) => {
      if (this.state.index > 0) {
        return {index: this.state.index - 1}
      }
    })
    this.doApiRequest(this.state.index - 1)
  }
}

export default App;
