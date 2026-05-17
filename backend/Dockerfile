# Stage 1: Build stage
# use small version of python
FROM python:3.12-slim as builder
# set home base folder inside container
WORKDIR /app
COPY requirements.txt .
# install libraries into specific folder & don't save the download files
# installer files are not needed when the library is installed
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Final Runtime stage
# start a new empty python environment
FROM python:3.12-slim
WORKDIR /app
# get installed libraries from builder stage
# temporary build tools and compilers are left behind
COPY --from=builder /root/.local /root/.local
# copy actual python code: main.py etc into clean image
COPY . .
# tells os to find copied python libraries
ENV PATH=/root/.local/bin:$PATH
# command tp start server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]