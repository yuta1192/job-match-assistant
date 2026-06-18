# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_06_18_120006) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "analysis_results", force: :cascade do |t|
    t.bigint "job_posting_id", null: false
    t.text "matched_points", default: [], array: true
    t.text "weak_points", default: [], array: true
    t.text "concerns", default: [], array: true
    t.text "interview_questions", default: [], array: true
    t.text "suggested_positioning"
    t.text "raw_response"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["job_posting_id"], name: "index_analysis_results_on_job_posting_id", unique: true
  end

  create_table "generated_replies", force: :cascade do |t|
    t.bigint "job_posting_id", null: false
    t.text "body", null: false
    t.string "tone", default: "casual", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["job_posting_id"], name: "index_generated_replies_on_job_posting_id"
  end

  create_table "interview_memos", force: :cascade do |t|
    t.bigint "job_posting_id", null: false
    t.date "interview_date", null: false
    t.string "interviewer"
    t.text "memo", null: false
    t.text "technical_notes"
    t.text "concerns"
    t.text "next_action"
    t.integer "motivation_level"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["job_posting_id"], name: "index_interview_memos_on_job_posting_id"
  end

  create_table "job_postings", force: :cascade do |t|
    t.string "company_name", null: false
    t.string "title", null: false
    t.text "description", null: false
    t.string "url"
    t.string "employment_type", default: "full_time", null: false
    t.boolean "remote_available", default: false, null: false
    t.string "status", default: "interested", null: false
    t.text "memo"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "job_tech_stacks", force: :cascade do |t|
    t.bigint "job_posting_id", null: false
    t.string "name", null: false
    t.string "category", null: false
    t.string "importance", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["job_posting_id"], name: "index_job_tech_stacks_on_job_posting_id"
  end

  create_table "skill_profiles", force: :cascade do |t|
    t.text "summary"
    t.text "main_skills", default: [], array: true
    t.text "learning_skills", default: [], array: true
    t.text "strong_points", default: [], array: true
    t.text "desired_roles", default: [], array: true
    t.string "desired_work_style"
    t.integer "experience_years"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "analysis_results", "job_postings"
  add_foreign_key "generated_replies", "job_postings"
  add_foreign_key "interview_memos", "job_postings"
  add_foreign_key "job_tech_stacks", "job_postings"
end
