output "eb_app" { value = aws_elastic_beanstalk_application.app.name }
output "eb_env" { value = aws_elastic_beanstalk_environment.env.name }
output "app_version" { value = aws_elastic_beanstalk_application_version.ver.name }
output "endpoint_url" { value = aws_elastic_beanstalk_environment.env.endpoint_url }
