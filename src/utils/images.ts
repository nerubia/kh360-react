export const getSurveyImage = (file_name: string, survey_template_id: string) => {
  return `https://kh360-assets.s3.ap-southeast-1.amazonaws.com/surveys/${survey_template_id}/${file_name}`
}
