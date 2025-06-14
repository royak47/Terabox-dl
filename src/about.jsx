import React from 'react';
import header from './components/header';
import footer from './footer';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              About
            </h1>
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 prose dark:prose-invert">
              <h2>Hey, I'm Mitt Ydv</h2>
              <p>
                I've been making downloadterabox apps and websites for a few days now, and I love every bit of it. I'm not just a one-person show – I run a little company that makes awesome apps for awesome clients.
              </p>
              <h3>How It All Started?</h3>
              <p>
                I got into this because I wanted to make things that make life easier. downloadterabox is my way of sharing useful tools with you.
              </p>
              <h3>What I Do</h3>
              <p>
                I'm the guy who dreams up team ideas, writes the code, and makes sure everything runs smoothly. My goal is to make tech simple and helpful for everyone.
              </p>
              <p>
                Yep, I've got a small team helping me out. Together, we're on a mission to create apps that make your digital life better.
              </p>
              <h3>Join the Fun</h3>
              <p>
                Thanks for being here and checking out. Let's make the digital world a bit more awesome together! Cheers,
              </p>
              <p className="font-semibold">Mitt Ydv<br />Founder and Developer</p>
            </div>
          </div>
        </div>
      </main>
      <footer />
    </div>
  );
};

export default About;