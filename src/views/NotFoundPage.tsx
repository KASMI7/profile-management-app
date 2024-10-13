import React from 'react';

const NotFoundPage = () => {
  return (
    <section className='flex items-center h-[100vh] p-16 dark:bg-gray-50 dark:text-gray-800'>
      <div className='container flex flex-col items-center justify-center px-5 mx-auto my-8'>
        <div className='max-w-md text-center'>
          <h2 className='mb-8 font-extrabold text-9xl dark:text-gray-400'>
            <span className='sr-only'>Error</span>404
          </h2>
          <p className='text-2xl font-semibold md:text-3xl'>Sorry, we couldn't find this page.</p>
          <p className='mt-4 mb-8 dark:text-gray-600'>But dont worry, you can find plenty of other things on our homepage.</p>
          <a rel='noopener noreferrer' href='#profile-form' className='btn border-none w-[70%] mt-5 text-white py-2 rounded-lg' style={{ background: 'linear-gradient(to right, #f78312 0, #f44336 100%)' }}>
            Back to homepage
          </a>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
