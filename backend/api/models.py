from djongo import models


class Profile(models.Model):
    id = models.ObjectIdField(primary_key=True)  # Added this line
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    institution = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    research_interests = models.JSONField()  # Storing a list of strings as JSON
    publications = models.JSONField()  # Storing a list of strings as JSON
    profile_picture_url = models.URLField()


class Settings(models.Model):
    id = models.ObjectIdField(primary_key=True)  # Added this line
    language = models.CharField(max_length=50)
    notifications_enabled = models.BooleanField()
    theme = models.CharField(max_length=50)


class User(models.Model):
    user_id = models.CharField(max_length=100, primary_key=True)
    username = models.CharField(max_length=100)
    email = models.EmailField()
    role = models.CharField(max_length=50)
    created_at = models.DateTimeField()
    last_login = models.DateTimeField()
    profile = models.EmbeddedField(model_container=Profile)
    settings = models.EmbeddedField(model_container=Settings)


class DataSource(models.Model):
    source_id = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    description = models.TextField()
    integration_date = models.DateTimeField()


class EthicalApproval(models.Model):
    id = models.ObjectIdField(primary_key=True)  # Added this line
    approved = models.BooleanField()
    approval_id = models.CharField(max_length=100)
    approval_date = models.DateTimeField()


class ResearchProject(models.Model):
    project_id = models.CharField(max_length=100, primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField()
    last_modified = models.DateTimeField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    collaborators = models.JSONField()  # Storing a list of user IDs as JSON
    status = models.CharField(max_length=50)
    tags = models.JSONField()  # Storing a list of strings as JSON
    data_sources = models.JSONField()  # Storing a list of data source dicts as JSON
    publications = models.JSONField()  # Storing a list of strings as JSON
    ethical_approval = models.EmbeddedField(model_container=EthicalApproval)


class Hyperparameters(models.Model):
    id = models.ObjectIdField(primary_key=True)  # Added this line
    learning_rate = models.FloatField()
    batch_size = models.IntegerField()
    epochs = models.IntegerField()
    optimizer = models.CharField(max_length=100)


class PerformanceMetrics(models.Model):
    id = models.ObjectIdField(primary_key=True)  # Added this line
    accuracy = models.FloatField()
    precision = models.FloatField()
    recall = models.FloatField()
    f1_score = models.FloatField()


class Deployment(models.Model):
    id = models.ObjectIdField(primary_key=True)  # Added this line
    deployed = models.BooleanField()
    deployment_date = models.DateTimeField()
    deployment_platform = models.CharField(max_length=100)
    endpoint_url = models.URLField()


class ModelMetadata(models.Model):
    model_id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField()
    last_modified = models.DateTimeField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(
        ResearchProject, null=True, blank=True, on_delete=models.SET_NULL
    )
    version = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    tags = models.JSONField()  # Storing a list of strings as JSON
    hyperparameters = models.EmbeddedField(model_container=Hyperparameters)
    performance_metrics = models.EmbeddedField(model_container=PerformanceMetrics)
    deployment = models.EmbeddedField(model_container=Deployment)


class Log(models.Model):
    log_id = models.CharField(max_length=100, primary_key=True)
    timestamp = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=100)
    description = models.TextField()
    resource_type = models.CharField(max_length=100)
    resource_id = models.CharField(max_length=100)
    ip_address = models.GenericIPAddressField()
    status = models.CharField(max_length=50)
