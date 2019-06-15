import SVD from './svd'

/**
 * Implementation of a Least Square Evaluation function as descripted in
 * https://www.geometrictools.com/Documentation/LeastSquaresFitting.pdf (par. 3)
 * This will return a plane in the form Ax + By + C = z
 */

// TODO CHANGE COMMENT WITH THE NEW IMPLEMENTATION
export default (points) => {
  // INPUT VALIDATION

  // Check if the input array is well-formed
  if (!(points instanceof Array)) {
    throw new TypeError('This function accepts only an Array of points as input')
  }

  if (points.length < 3) {
    throw new TypeError('You need at least three points to define a plane')
  }

  points.forEach(point => {
    if (!(point instanceof Object)) {
      throw new TypeError('The input should contains only points ' +
        'with the following structure: {x:<number>, y:<number>, z:<number>}')
    } else {
      if (isNaN(point.x) ||
        isNaN(point.y) ||
        isNaN(point.z)) {
        throw new TypeError('The input should contains only points ' +
          'with the following structure: {x:<number>, y:<number>, z:<number>}')
      }
    }
  })

  // Check if all points are aligned with the y-axis
  let allYEquals = true
  let prevY = points[0].y
  for (let i = 1; i < points.length && allYEquals; i++) {
    if (points[i].y !== prevY) {
      allYEquals = false
    }
  }

  if (allYEquals) {
    throw new TypeError('Unable to find a plane for vertical points')
  }

  let meanCoordinates = (pointsArray) => {
    let xs = 0
    let ys = 0
    let zs = 0
    pointsArray.forEach(point => {
      xs += point.x
      ys += point.y
      zs += point.z
    })

    return {
      xMean: xs / pointsArray.length,
      yMean: ys / pointsArray.length,
      zMean: zs / pointsArray.length
    }
  }

  let means = meanCoordinates(points)
  let pointsNormalized = []

  for (let i = 0; i < points.length; i++) {
    pointsNormalized[i] = new Array(3)
  }

  points.forEach((point, index) => {
    pointsNormalized[index][0] = point.x - means.xMean
    pointsNormalized[index][1] = point.y - means.yMean
    pointsNormalized[index][2] = point.z - means.zMean
  })

  let {v} = SVD(pointsNormalized)

  let normalize = -1 / v[2][2]

  let A = v[0][2] * normalize
  let B = v[1][2] * normalize
  let C = -(means.xMean * A + means.yMean * B + means.zMean * v[2][2] * normalize)

  return {A, B, C}
}