FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["WongaFair.Api/WongaFair.Api.csproj", "WongaFair.Api/"]
RUN dotnet restore "WongaFair.Api/WongaFair.Api.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/WongaFair.Api"
RUN dotnet publish "WongaFair.Api.csproj" -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
EXPOSE 80
EXPOSE 443

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "WongaFair.Api.dll"]

