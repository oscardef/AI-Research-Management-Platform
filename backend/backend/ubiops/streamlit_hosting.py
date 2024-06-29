import streamlit as st
import ubiops 
import tempfile
from time import sleep

st.title("Streamlit and UbiOps example")

# Connect with your UbiOps environment
API_TOKEN = 'Token 0000000000000000000000000000000000000' # Make sure this is in the format "Token token-code"
PROJECT_NAME = 'dash-it-lab'

# PIPELINE_NAME = 'mnist-number-prediction-pipeline'
PIPELINE_NAME = 'mnist-letter-prediction-pipeline'

# API setup 
if PROJECT_NAME and API_TOKEN and PIPELINE_NAME:
    # Only reconnect if API object is not in session state
    if 'ubiops_api' not in st.session_state:
        with st.spinner("Connecting to UbiOps API"):
            configuration = ubiops.Configuration(host="https://api.ubiops.com/v2.1")
            configuration.api_key['Authorization'] = API_TOKEN

            st.session_state.client = ubiops.ApiClient(configuration)
            st.session_state.ubiops_api = ubiops.CoreApi(st.session_state.client)
            pipeline_info = st.session_state.ubiops_api.pipelines_get(PROJECT_NAME, PIPELINE_NAME)
           
            print(pipeline_info)
            
            sleep(2) # sleep for 2s to showcase progress spinners
            
            # Use the streamlit session to store API object
            if(st.session_state.ubiops_api.service_status().status == 'ok' ):
                st.success("Connected to UbiOps API!")
            else:
                st.error("Not connected!")
                


# File upload
upload_file = st.file_uploader("Choose a file")
if upload_file is not None:
    if 'results' not in st.session_state:
        st.session_state.results = []
    with open("out.txt", "wb") as outfile:
        # Copy the BytesIO stream to the output file
        outfile.write(upload_file.getvalue())
    file_uri = ubiops.utils.upload_file(st.session_state.client, PROJECT_NAME, 'out.txt')
    # Make a request using the file URI as input.
    data = {'image': file_uri}
    
    result = st.session_state.ubiops_api.pipeline_requests_create(
        project_name=PROJECT_NAME,
        pipeline_name=PIPELINE_NAME,
        data=data
    )
    # Store results in session
    st.session_state.results.append([result,upload_file])

# Show all results in from session
if 'results' in st.session_state: 
    for r in st.session_state.results[::-1]:
        c1, c2 = st.columns(2)
        c2.write(r[0].result)
        c1.image(r[1])
