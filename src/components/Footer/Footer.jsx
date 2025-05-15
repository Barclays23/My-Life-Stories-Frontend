import React from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp, FaLinkedin, FaGithub } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
   return (
      <footer className="footer py-3">
         <div className="container mx-auto text-center">
            <div className="social-media flex justify-center space-x-5 mb-4 mt-2">
               <a href="https://facebook.com/sajee23" className="footer-icon" aria-label="Facebook">
                  <FaFacebook className="icon" />
               </a>
               <a href="https://www.instagram.com/barclays_sajeer_23/" className="footer-icon" aria-label="Instagram">
                  <FaInstagram className="icon" />
               </a>
               <a href="https://wa.me/919633699766" className="footer-icon" aria-label="WhatsApp">
                  <FaWhatsapp className="icon" />
               </a>
               <a href="https://www.linkedin.com/in/sajeer23/" className="footer-icon" aria-label="LinkedIn">
                  <FaLinkedin className="icon" />
               </a>
               <a href="https://github.com/Barclays23" className="footer-icon" aria-label="GitHub">
                  <FaGithub className="icon" />
               </a>
            </div>

            <p className="contact-info mb-0">
               <a href="mailto:itsmesajeer@gmail.com" className="footer-link">itsmesajeer@gmail.com</a>
               <span className="seperation-line" aria-hidden="true"> | </span>
               <a href="tel:+919633699766" className="footer-link">+919 633-699-766</a>
            </p>

            <p className="copyright text-xs">
               © 2025 Raihan Arsh - All Rights Reserved.
            </p>
         </div>
      </footer>
   );
};

export default Footer;