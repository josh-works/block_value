class AddSizeRatioToUserPath < ActiveRecord::Migration[5.0]
  def change
    change_table :user_paths do |t|
      t.float :size_ratio
      t.integer :line_count
      t.string :user_id
    end
  end
end
