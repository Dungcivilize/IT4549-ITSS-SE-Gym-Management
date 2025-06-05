import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../assets/css/Home.module.css';
import logo from '../../assets/img/logo.png';
import header from '../../assets/img/header.png';
import class1 from '../../assets/img/class-1.jpg';
import class2 from '../../assets/img/class-2.jpg';
import join from '../../assets/img/join.jpg';
import axios from 'axios';

function Home() {
  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.nav__logo}>
          <Link to="#">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <ul className={styles.nav__links}>
          <li className={styles.link}>
            <Link to="#">Home</Link>
          </li>
          <li className={styles.link}>
            <Link to="#">Program</Link>
          </li>
          <li className={styles.link}>
            <Link to="#">Service</Link>
          </li>
          <li className={styles.link}>
            <Link to="#">About</Link>
          </li>
          <li className={styles.link}>
            <Link to="#">Community</Link>
          </li>
        </ul>
        <Link to="/login" className={styles.btn}>
          Login
        </Link>
        <Link to="/register" className={styles.btn}>
          Register
        </Link>
      </nav>

      <header
        className={`${styles.section__container} ${styles.header__container}`}
      >
        <div className={styles.header__content}>
          <span className={styles.bg__blur}></span>
          <span className={`${styles.bg__blur} ${styles.header__blur}`}></span>
          <h4>BEST FITNESS IN THE TOWN</h4>
          <h1>
            <span>MAKE</span> YOUR BODY SHAPE
          </h1>
          <p>
            Unleash your potential and embark on a journey towards a stronger,
            fitter, and more confident you. Sign up for 'Make Your Body Shape'
            now and witness the incredible transformation your body is capable
            of!
          </p>
          <Link to="/login" className={styles.btn}>
            Login
          </Link>
        </div>
        <div className={styles.header__image}>
          <img src={header} alt="header" />
        </div>
      </header>

      <section
        className={`${styles.section__container} ${styles.explore__container}`}
      >
        <div className={styles.explore__header}>
          <h2 className={styles.section__header}>EXPLORE OUR PROGRAM</h2>
          <div className={styles.explore__nav}>
            <span>
              <i className="ri-arrow-left-line"></i>
            </span>
            <span>
              <i className="ri-arrow-right-line"></i>
            </span>
          </div>
        </div>
        <div className={styles.explore__grid}>
          <ExploreCard
            icon="ri-boxing-fill"
            title="Strength"
            description="Embrace the essence of strength..."
          />
          <ExploreCard
            icon="ri-heart-pulse-fill"
            title="Physical Fitness"
            description="It encompasses a range of activities..."
          />
          <ExploreCard
            icon="ri-run-line"
            title="Fat Lose"
            description="Through a combination of workout routines..."
          />
          <ExploreCard
            icon="ri-shopping-basket-fill"
            title="Weight Gain"
            description="Designed for those who want to gain weight"
          />
        </div>
      </section>

      <section
        className={`${styles.section__container} ${styles.class__container}`}
      >
        <div className={styles.class__image}>
          <span className={styles.bg__blur}></span>
          <img src={class1} alt="class" className={styles.class__img_1} />
        </div>
        <div className={styles.class__content}>
          <h2 className={styles.section__header}>
            THE CLASS YOU WILL GET HERE
          </h2>
          <p>Led by our team of expert and motivational instructors...</p>
          <Link to="/login" className={styles.btn}>
            Login
          </Link>
        </div>
      </section>

      <section
        className={`${styles.section__container} ${styles.join__container}`}
      >
        <h2 className={styles.section__header}>WHY JOIN US ?</h2>
        <p className={styles.section__subheader}>
          Our diverse membership base...
        </p>
        <div className={styles.join__image}>
          <img src={join} alt="Join" />
          <div className={styles.join__grid}>
            <JoinCard
              icon="ri-user-star-fill"
              title="Personal Trainer"
              desc="Unlock your potential..."
            />
            <JoinCard
              icon="ri-vidicon-fill"
              title="Practice Sessions"
              desc="Elevate your fitness..."
            />
            <JoinCard
              icon="ri-building-line"
              title="Good Management"
              desc="Experience excellence..."
            />
          </div>
        </div>
      </section>

      <section
        className={`${styles.section__container} ${styles.price__container}`}
      >
        <h2 className={styles.section__header}>OUR PRICING PLAN</h2>
        <p className={styles.section__subheader}>
          Our pricing plan comes with various tiers...
        </p>
        <div className={styles.price__grid}>
          <PriceCard
            plan="Basic Plan"
            price={16}
            features={['Smart workout plan', 'At home workouts']}
          />
          <PriceCard
            plan="Weekly Plan"
            price={25}
            features={['PRO Gyms', 'Smart workout plan', 'At home workouts']}
          />
          <PriceCard
            plan="Monthly Plan"
            price={45}
            features={[
              'ELITE Gyms & Classes',
              'PRO Gyms',
              'Smart workout plan',
              'At home workouts',
              'Personal Training',
            ]}
          />
        </div>
      </section>

      <footer
        className={`${styles.section__container} ${styles.footer__container}`}
      >
        <span className={styles.bg__blur}></span>
        <span className={`${styles.bg__blur} ${styles.footer__blur}`}></span>
        <div className={styles.footer__col}>
          <div className={styles.footer__logo}>
            <Link to="#">
              <img src={logo} alt="logo" />
            </Link>
          </div>
          <p>Take the first step towards a healthier you</p>
          <div className={styles.footer__socials}>
            <a href="#">
              <i className="ri-facebook-fill"></i>
            </a>
            <a href="#">
              <i className="ri-instagram-line"></i>
            </a>
            <a href="#">
              <i className="ri-twitter-fill"></i>
            </a>
          </div>
        </div>
        <div className={styles.footer__col}>
          <h4>Company</h4>
          <a href="#">Business</a>
          <a href="#">Franchise</a>
          <a href="#">Partnership</a>
          <a href="#">Network</a>
        </div>
        <div className={styles.footer__col}>
          <h4>About Us</h4>
          <a href="#">Blogs</a>
          <a href="#">Security</a>
          <a href="#">Careers</a>
        </div>
        <div className={styles.footer__col}>
          <h4>Contact</h4>
          <a href="#">Contact Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">BMI Calculator</a>
        </div>
      </footer>

      <div className={styles.footer__bar}>
        Copyright © 2024 Web Design Mastery. All rights reserved.
      </div>
    </>
  );
}

function ExploreCard({ icon, title, description }) {
  return (
    <div className={styles.explore__card}>
      <h4>{title}</h4>
      <p>{description}</p>
      <Link to="/login" className={styles.exploreBtn}>
        Login
      </Link>
    </div>
  );
}

function JoinCard({ icon, title, desc }) {
  return (
    <div className={styles.join__card}>
      <span>
        <i className={icon}></i>
      </span>
      <div className={styles.join__card__content}>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function PriceCard({ plan, price, features }) {
  return (
    <div className={styles.price__card}>
      <div className={styles.price__card__content}>
        <h4>{plan}</h4>
        <h3>${price}</h3>
        {features.map((f, i) => (
          <p key={i}>
            <i className="ri-checkbox-circle-line"></i> {f}
          </p>
        ))}
      </div>
      <Link to="/login" className={styles.btn}>
        Login
      </Link>
    </div>
  );
}

export default Home;
