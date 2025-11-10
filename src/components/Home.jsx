import { forwardRef } from 'react'

const Home = forwardRef(function Home({ children }, ref) {
  return (
    <main ref={ref} className="max-w-6xl mx-auto p-0 focus:outline-none" tabIndex={-1}>
      {children}
    </main>
  )
})

export default Home


