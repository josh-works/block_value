class CreatePaths < ActiveRecord::Migration[5.0]
  def change
    create_table :user_paths do |t|
      t.float :lat
      t.float :long, precision: 10, scale: 6
      t.string :category
      t.decimal :drawn_at, precision: 17
    end
  end
end
