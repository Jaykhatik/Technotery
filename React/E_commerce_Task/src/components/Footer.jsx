import React from 'react'
import '../styles/Footer.css'

function Footer() {
  return (
    <>
     <footer className="footer-div">
                <div className="footer-container">

                    <div className="footer-right">
                        <p>
                            Developed by <span className="name">Technotery</span>
                        </p>

                        <a
                            href="https://github.com/jaykhatik"
                            target="_blank"
                            className="github-link"
                        >
                            View code on Github
                            <span className="icon"><i className="fa-brands fa-github"></i></span>
                        </a>
                    </div>

                </div>
            </footer>
    </>
  )
}

export default Footer