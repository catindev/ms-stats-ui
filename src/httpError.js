import Cookies from 'js-cookie'

export default error => {
  if (error.message === 'Request failed with status code 403') {
    Cookies.remove('msid')
    document.location.href = '/'
  }
  console.error(error.message)
}