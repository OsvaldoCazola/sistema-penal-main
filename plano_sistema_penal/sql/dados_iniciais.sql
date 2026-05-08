-- ============================================================
-- DADOS INICIAIS — DataInitializer referencia
-- Categorias de crime e artigos fundamentais do CPA 2021
-- ============================================================

-- CATEGORIAS DE CRIME
INSERT INTO categoria_crime (id, nome, descricao) VALUES
  (gen_random_uuid(), 'Crimes contra a Vida',                'Homicidio, aborto e crimes que atentam contra a vida humana — Art. 148-154 CPA'),
  (gen_random_uuid(), 'Crimes contra a Integridade Fisica',  'Ofensas corporais, violencia de genero — Art. 155-165 CPA'),
  (gen_random_uuid(), 'Crimes contra a Liberdade',           'Sequestro, rapto, coaccao, ameaca, violacao de domicilio — Art. 166-174 CPA'),
  (gen_random_uuid(), 'Crimes contra a Honra',               'Injuria, difamacao, caluna — Art. 174-179 CPA'),
  (gen_random_uuid(), 'Crimes contra a Familia',             'Violencia domestica, abandono de familia — Art. 175-182 CPA'),
  (gen_random_uuid(), 'Crimes contra o Patrimonio',          'Furto, roubo, extorsao, burla, dano — Art. 226-248 CPA'),
  (gen_random_uuid(), 'Crimes contra a Saude Publica',       'Trafico, consumo de estupefacientes — Art. 283-295 CPA');

-- LEI PRINCIPAL
INSERT INTO lei (id, tipo, numero, ano, ementa, status) VALUES
  ('00000000-0000-0000-0000-000000000001',
   'Codigo Penal', 'Lei n.o 38/20', 2020,
   'Codigo Penal da Republica de Angola — aprovado pela Lei n.o 38/20 de 11 de Novembro',
   'VIGENTE');

-- ARTIGOS FUNDAMENTAIS (amostra — completar no DataInitializer com todos os artigos)
-- Crimes contra a Vida
INSERT INTO artigo (id, lei_id, categoria_id, numero, titulo, descricao, pena_min_meses, pena_max_meses) VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001',
   (SELECT id FROM categoria_crime WHERE nome = 'Crimes contra a Vida'),
   '148', 'Homicidio simples',
   'Quem matar outra pessoa e punido com pena de prisao de 8 a 12 anos.',
   96, 144),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001',
   (SELECT id FROM categoria_crime WHERE nome = 'Crimes contra a Vida'),
   '149', 'Homicidio qualificado',
   'O homicidio e qualificado quando praticado com premeditacao, motivo futil, crueldade ou por agente que actue com frieza de animo. Pena de 12 a 20 anos.',
   144, 240),

-- Crimes contra a Integridade Fisica
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001',
   (SELECT id FROM categoria_crime WHERE nome = 'Crimes contra a Integridade Fisica'),
   '155', 'Ofensas corporais simples',
   'Quem ofender o corpo ou a saude de outra pessoa e punido com pena de prisao ate 2 anos ou pena de multa.',
   0, 24),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001',
   (SELECT id FROM categoria_crime WHERE nome = 'Crimes contra a Integridade Fisica'),
   '156', 'Ofensas corporais graves',
   'Se das ofensas corporais resultar privacao de sentido ou orgao, deformacao grave e permanente, doenca grave ou incapacidade para o trabalho: pena de 2 a 8 anos.',
   24, 96),

-- Crimes contra a Liberdade
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001',
   (SELECT id FROM categoria_crime WHERE nome = 'Crimes contra a Liberdade'),
   '166', 'Sequestro',
   'Quem detiver, retiver ou por qualquer forma privar outra pessoa da sua liberdade de movimentos e punido com pena de prisao de 2 a 8 anos.',
   24, 96),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001',
   (SELECT id FROM categoria_crime WHERE nome = 'Crimes contra a Liberdade'),
   '170', 'Ameaca',
   'Quem ameacar outra pessoa com a pratica de crime contra ela ou contra terceiros, de forma adequada a provocar-lhe medo ou inquietacao, e punido com pena de prisao de 1 a 3 anos.',
   12, 36),

-- Crimes contra a Honra
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001',
   (SELECT id FROM categoria_crime WHERE nome = 'Crimes contra a Honra'),
   '174', 'Injuria',
   'Quem injuriar outra pessoa, imputando-lhe factos ou formulando juizos ofensivos da sua honra ou consideracao, e punido com pena de prisao ate 6 meses ou pena de multa.',
   0, 6),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001',
   (SELECT id FROM categoria_crime WHERE nome = 'Crimes contra a Honra'),
   '177', 'Difamacao',
   'Quem, dirigindo-se a terceiro, imputar a outra pessoa factos ou formular juizos ofensivos da sua honra ou consideracao, e punido com pena de prisao ate 1 ano ou pena de multa.',
   0, 12),

-- Crimes contra a Familia
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001',
   (SELECT id FROM categoria_crime WHERE nome = 'Crimes contra a Familia'),
   '175', 'Violencia domestica',
   'Quem, de modo reiterado ou nao, infligir maus-tratos fisicos ou psiquicos, incluindo castigos corporais, privacoes da liberdade e ofensas sexuais ao conjuge ou ex-conjuge, a pessoa de outro ou igual sexo com quem o agente mantenha ou tenha mantido uma relacao analogica, e punido com pena de prisao de 1 a 5 anos.',
   12, 60),

-- Crimes contra o Patrimonio
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001',
   (SELECT id FROM categoria_crime WHERE nome = 'Crimes contra o Patrimonio'),
   '226', 'Furto simples',
   'Quem, com intencao de se apropriar ilegitimamente, subtrair coisa movel alheia e punido com pena de prisao ate 3 anos ou pena de multa.',
   0, 36),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001',
   (SELECT id FROM categoria_crime WHERE nome = 'Crimes contra o Patrimonio'),
   '233', 'Roubo',
   'Quem subtrair, ou constrangido com violencia ou ameaca grave, coisa movel alheia, com intencao de a apropriar ilegitimamente e punido com pena de prisao de 2 a 8 anos.',
   24, 96);
