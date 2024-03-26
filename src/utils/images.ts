export const getSurveyImage = (file_name: string, survey_admin_id: string) => {
  return `https://kh360-assets-beta.s3.ap-southeast-1.amazonaws.com/surveys/${survey_admin_id}/${file_name}`
}
