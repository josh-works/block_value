Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root to: "maps#index"


  post '/paths', to: 'user_paths#create'
  get '/paths', to: 'user_paths#index'
  delete '/paths', to: 'user_paths#destroy'
end
