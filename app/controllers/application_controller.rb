class ApplicationController < ActionController::Base
  ActionController::Parameters.permit_all_parameters = true
  
  protect_from_forgery with: :exception
end
