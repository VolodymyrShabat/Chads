// A mock function to mimic making an async request for data
function fetchCount(amount = 1) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      const random = Math.floor(Math.random() * 10)
      if (random < 7) return reject(new Error("Error Message"))
      return resolve({ data: amount })
    }, 500)
  )
}

export default fetchCount
